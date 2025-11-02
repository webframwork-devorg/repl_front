import { supabase } from "@/api/supabaseClient";

export async function getPlaylists() {
  try {
    const { data, error } = await supabase
      .from("playlists") 
      .select("*") 
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("플레이리스트 불러오기 실패:", error.message);
    throw error;
  }
}
