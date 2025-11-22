import { supabase } from "@/api/supabaseClient";
 
// 현재 로그인된 사용자의 모든 플레이리스트를 가져옵니다.
export async function getMyPlaylists() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("사용자 정보 가져오기 오류:", userError);
      throw userError;
    }

    if (!user) {
      console.log("로그인된 사용자가 없어 플레이리스트를 가져올 수 없습니다.");
      return [];
    }

    const { data, error } = await supabase
      .from("playlists") 
      .select("playlist_id, p_title")
      .eq("user_id", user.id); 

    if (error) {
      console.error("플레이리스트 조회 오류:", error);
      throw error;
    }

    const formattedData = data.map(playlist => ({
      id: playlist.playlist_id,
      title: playlist.p_title,
    }));
    return formattedData;
    
  } catch (error) {
    console.error("getMyPlaylists 함수 오류:", error);
    return []; 
  }
}
