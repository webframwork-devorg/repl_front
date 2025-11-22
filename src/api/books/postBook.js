import { supabase } from "@/api/supabaseClient";

/**
 * 플레이리스트에 새 책(아이템) 추가 (책 정보 저장 + 아이템 생성 + 태그 연결)
 *
 * @param {Object} payload
 * @param {number} payload.playlistId - 책을 추가할 플레이리스트 ID (playlist_items.playlist_id)
 * @param {Object} payload.bookData - 책 정보 객체 (book_id(ISBN), title, author 등)
 * @param {Object} payload.userReview - 유저의 감상평 (rating, comment, read_date 등)
 * @param {Object} payload.image - { type: 'file' | 'url', file?: File, url?: string }
 * @param {Array} payload.tags - 선택된 태그 배열 (id, tag_id 등)
 */
export async function postPlaylistItem({ playlistId, bookData, userReview, image, tags }) {
  try {
    let coverImageUrl = image?.url || bookData.cover_image_url || "";

    if (image?.type === "file" && image.file) {
      const fileName = `books/${Date.now()}_${image.file.name}`; // 경로 구분 위해 books 폴더 권장

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, image.file);

      if (uploadError) throw uploadError;

      coverImageUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/thumbnails/${fileName}`;
    }

    const { error: bookError } = await supabase
      .from("books")
      .upsert([
        {
          book_id: bookData.book_id,
          b_title: bookData.title,
          author: bookData.author,
          cover_image_url: coverImageUrl,
        },
      ]);

    if (bookError) throw bookError;

    const { data: itemData, error: itemError } = await supabase
      .from("playlist_items")
      .insert([
        {
          playlist_id: playlistId,        
          book_id: bookData.book_id,     
          user_rating: userReview?.rating || 0,
          user_comment: userReview?.comment || "",
          read_date: userReview?.readDate || new Date(),
          like_count: 0,
          comment_count: 0,
        },
      ])
      .select() 
      .single();

    if (itemError) throw itemError;

    const newItemId = itemData.item_id; 
    console.log("아이템(책) 등록 성공:", itemData);

    if (tags && tags.length > 0) {
      const validTags = tags
        .map((t) => {
          if (typeof t === "number") return t;
          if (t?.tag_id) return t.tag_id;
          if (t?.id) return t.id;
          return null;
        })
        .filter((id) => Number.isInteger(id));

      if (validTags.length > 0) {
        const tagInserts = validTags.map((tagId) => ({
          item_id: newItemId,
          tag_id: tagId,      
        }));

        const { error: tagError } = await supabase
          .from("playlistitem_tags") 
          .insert(tagInserts);

        if (tagError) throw tagError;
        console.log("태그 연결 완료:", tagInserts);
      }
    } else {
      console.log("선택된 태그 없음");
    }

    return { success: true, data: itemData };

  } catch (error) {
    console.error("아이템 등록 오류:", error.message || error);
    return { success: false, error };
  }
}