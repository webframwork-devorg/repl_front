import { supabase } from "@/api/supabaseClient";

export async function getPlaylistTags() {
  try {
    const { data, error } = await supabase
      .from("playlist_tags")
      .select('*');

    if (error) throw error;

    return data.map((tag) => ({
      id: playlist_tags.tag_id,
      playlistId: playlist_tags.playlist_id,
    }));
  } catch (error) {
    console.error("태그 불러오기 실패:", error.message);
    throw error;
  }
}
