import { supabase } from "@/api/supabaseClient";

// 함수 이름에 맞게 ID를 인자로 추가하고, 기존 인자는 필요 없다면 제거합니다.
export async function getPlaylistById(playlistId, sort = "latest", selectedTags = []) {
  try {
    const { data: playlistitemData, error: playlistitemError } = await supabase
      .from("playlists_items")
      .select(`
        *,
        playlist_tags (
          tag_id,
          tags (
            tag_name
          )
        )
      `)
      // 함수 이름에 맞게 playlistId로 필터링 추가 (필요한 경우)
      .eq('id', playlistId); 

    // 에러 처리
    if (playlistError) {
      console.error("플레이리스트 조회 오류:", playlistError);
      throw playlistError; // 오류를 외부로 던집니다.
    }

  } catch (error) {
    // try/catch 블록에서 발생한 모든 오류를 처리
    console.error("전체 함수 실행 오류:", error);
    // 필요에 따라 null이나 적절한 오류 응답 반환
    return null; 
  }
}