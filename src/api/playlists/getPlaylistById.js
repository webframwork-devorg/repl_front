import { supabase } from "@/api/supabaseClient";

export async function getPlaylistById(playlistId, sort = "latest", selectedTags = []) {
  try {
    const { data, error } = await supabase.from("playlists").select(`
      playlist_id,
      user_id,
      p_title,
      thumbnail_url,
      summary,
      like_count,
      created_at,
      updated_at,
      users:users!playlists_user_id_fkey( 
        profile_nickname,
        profile_image_url
      ),
      playlist_tags (
        playlist_id,
        tag_id,
        tags ( tag_name )
      ),
      playlist_items (
        item_id,
        book_id,
        user_comment,
        user_rating,
        read_date,
        books (
          b_title,
          author,
          cover_image_url
        ),
        playlistitem_tags (
          tag_id,
          tags ( tag_name )
        )
      )
    `).eq('playlist_id', playlistId).single(); // .single()은 단일 객체를 반환합니다.

    if (error) throw error;

    // .single()은 데이터가 없으면 data가 null일 수 있습니다.
    if (!data) {
      console.warn("해당 ID의 플레이리스트를 찾을 수 없습니다:", playlistId);
      return null;
    }

    console.log("🎧 Supabase 원본 데이터 (단일 객체):", data);


    // 'data' 객체를 직접 'formatted' 객체로 변환합니다.
    const formatted = {
      id: data.playlist_id,
      username: data.users?.profile_nickname || "익명 사용자",
      userImage: data.users?.profile_image_url || null,
      title: data.p_title,
      image: data.thumbnail_url,
      description: data.summary,
      likeCount: data.like_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.playlist_tags?.map((t) => ({
        id: t.tag_id,
        name: t.tags?.tag_name
      })) || [],
      items: data.playlist_items?.map((pi) => ({
        id: pi.item_id,
        bookId: pi.book_id,
        comment: pi.user_comment,
        rating: pi.user_rating,
        readDate: pi.read_date,
        book: {
          title: pi.books?.b_title || null,
          author: pi.books?.author || null,
          cover: pi.books?.cover_image_url || null,
        }
      })) || [],
    };

    // 포맷팅된 단일 객체를 반환합니다.
    return formatted;

  } catch (error) {
    console.error("전체 함수 실행 오류:", error);
    return null;
  }
}