import { supabase } from "@/api/supabaseClient";


export async function getPlaylists(sort = "latest", selectedTags = []) {
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
  `);

    if (error) throw error;

    let filtered = data;

    if (selectedTags.length === 1) {
      const tag = selectedTags[0];
      filtered = data.filter((playlist) =>
        playlist.playlist_tags?.some((pt) => pt.tags?.tag_name === tag)
      );
    } else if (selectedTags.length >= 2) {
      filtered = data.filter((playlist) =>
        selectedTags.every((tag) =>
          playlist.playlist_tags?.some((pt) => pt.tags?.tag_name === tag)
        )
      );
    }

    if (sort === "latest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === "likes") {
      filtered.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    } else if (sort === "title") {
      filtered.sort((a, b) => a.p_title.localeCompare(b.p_title));
    }

    const formatted = filtered.map((item) => ({
      id: item.playlist_id,
      username: item.users?.profile_nickname || "익명 사용자",
      userImage: item.users?.profile_image_url || null,
      title: item.p_title,
      image: item.thumbnail_url,
      description: item.summary,
      likeCount: item.like_count,
      tags:
        item.playlist_tags?.map((t) => t.tags?.tag_name).filter(Boolean) || [],

      subCards:
        item.playlist_items?.map((sub) => ({
          id: sub.item_id,
          bookId: sub.book_id,
          title: sub.books?.b_title || "제목 없음",
          author: sub.books?.author || "작자 미상",
          image:
            sub.books?.cover_image_url ||
            "https://via.placeholder.com/240x320?text=No+Image",
          comment: sub.user_comment,
          rating: sub.user_rating,
          readDate: sub.read_date,
          tags:
            sub.playlistitem_tags
              ?.map((t) => t.tags?.tag_name)
              .filter(Boolean) || [],
        })) || [],
    }));

    return formatted;
  } catch (error) {
    console.error("플레이리스트 불러오기 실패:", error.message);
    throw error;
  }
}
