import { supabase } from "@/api/supabaseClient";

export async function getPlaylistById(playlistId) { // sort 파라미터 제거
 const { data: { user } } = await supabase.auth.getUser();

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
    created_at, 
    like_count,  
    books (
     b_title,
     author,
     cover_image_url
    )
   )
  `).eq('playlist_id', playlistId).single();

  if (error) throw error;

  if (!data) {
   console.warn("해당 ID의 플레이리스트를 찾을 수 없습니다:", playlistId);
   return null;
  }

  // 현재 유저가 이 글을 '좋아요' 했는지 확인
  let isLikedByUser = false;
  if (user) {
   const { data: likeData, error: likeError } = await supabase
    .from("user_playlist_likes") 
    .select("playlist_id")
    .eq("playlist_id", playlistId)
    .eq("user_id", user.id); 
   
   if (likeData && likeData.length > 0) {
    isLikedByUser = true;
   }
  }

  console.log("🎧 Supabase 원본 데이터 (단일 객체):", data);

  const formatted = {
      id: data.playlist_id,
      username: data.users?.profile_nickname || "익명 사용자",
      userImage: data.users?.profile_image_url || null,
      title: data.p_title,
      isLikedByUser: isLikedByUser,
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
        createdAt: pi.created_at, 
        likeCount: pi.like_count, 
        book: {
        title: pi.books?.b_title || null,
        author: pi.books?.author || null,
        cover: pi.books?.cover_image_url || null,
    }
   })) || [],
  };
  
  return formatted;

 } catch (error) {
  console.error("전체 함수 실행 오류:", error);
  return null;
 }
}

export async function togglePlaylistLike(playlistId, currentIsLiked) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("로그인이 필요합니다.");
    throw new Error("로그인이 필요합니다.");
  }

  try {
    if (currentIsLiked) {
      const { error } = await supabase
        .from("user_playlist_likes") 
        .delete()
        .match({ playlist_id: playlistId, user_id: user.id });
      
      if (error) throw error;

    } else {
      const { error } = await supabase
        .from("user_playlist_likes") 
        .insert({ playlist_id: playlistId, user_id: user.id });

      if (error) throw error;
    }

    return { success: true };

  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    // 에러를 ListPage의 catch 블록으로 전달
    throw error;
  }
}