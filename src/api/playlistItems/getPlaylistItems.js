import { supabase } from "@/api/supabaseClient";

/**
 *
 * @param {string} bookId - 조회할 책의 ID (ISBN 등)
 */
export async function getPlaylistItems(bookId) {
  try {
    const { data, error } = await supabase
      .from("playlist_items")
      .select(
        `
        item_id,
        user_rating,
        user_comment,
        read_date,

        playlistitem_tags (
          tag_id,
          tags ( tag_name )
        ),

        favorite_passages (
          passage_id,
          passage_text,
          page_number,
          background_id
        )
      `
      )
      .eq("book_id", bookId); 

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("해당 책에 대한 리뷰 아이템이 없습니다.");
      return { reviews: [] };
    }

    
    const reviews = data.map((item) => ({
      itemId: item.item_id,
      rating: item.user_rating,
      comment: item.user_comment,
      readDate: item.read_date,
      tags:
        item.playlistitem_tags
          ?.map((t) => t.tags?.tag_name)
          .filter(Boolean) || [],
      passages: item.favorite_passages || [],
    }));

    return { reviews };

  } catch (error) {
    console.error("플레이리스트 아이템 불러오기 실패:", error.message);
    throw error;
  }
}