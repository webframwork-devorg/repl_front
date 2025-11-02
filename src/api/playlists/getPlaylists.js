import { supabase } from "@/api/supabaseClient";

export async function getPlaylists(sort = "latest") {
  try {
    let query = supabase.from("playlists").select("*");

    if (sort === "latest") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "likes") {
      query = query.order("like_count", { ascending: false });
    } else if (sort === "title") {
      query = query.order("p_title", { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    const formatted = data.map((item) => ({
      id: item.playlist_id,
      username: item.user_id.slice(0, 6),
      title: item.p_title,
      image: item.thumbnail_url,
      description: item.summary,
      likeCount: item.like_count,
      created_at: item.created_at,
    }));

    return formatted;
  } catch (error) {
    console.error("플레이리스트 불러오기 실패:", error.message);
    throw error;
  }
}
