import { supabase } from "@/api/supabaseClient";

export async function getPlaylists(sort = "latest", selectedTags = []) {
  try {
    const { data, error } = await supabase.from("playlists").select(`
        *,
        playlist_tags (
          tag_id,
          tags (
            tag_name
          )
        )
      `);

    if (error) throw error;

    console.log("Supabase에서 받은 원본 데이터:", data);

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
      username: item.user_id?.slice(0, 6),
      title: item.p_title,
      image: item.thumbnail_url,
      description: item.summary,
      likeCount: item.like_count,
      tags:
        item.playlist_tags?.map((t) => t.tags?.tag_name).filter(Boolean) || [],
    }));

    return formatted;
  } catch (error) {
    console.error("플레이리스트 불러오기 실패:", error.message);
    throw error;
  }
}
