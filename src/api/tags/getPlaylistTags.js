import { supabase } from "@/api/supabaseClient";

export async function getTags() {
  try {
    const { data, error } = await supabase
      .from("playlist_tags")
      .select("tag_id, tag_name")
      .order("tag_name", { ascending: true });

    if (error) throw error;

    return data.map((tag) => ({
      id: tag.tag_id,
      name: tag.tag_name,
    }));
  } catch (error) {
    console.error("태그 목록 불러오기 실패:", error.message);
    throw error;
  }
}
