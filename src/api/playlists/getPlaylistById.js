import { supabase } from "@/api/supabaseClient";

export async function getPlaylistById(playlistId, sort = "latest", selectedTags = []) {
 try {
  
  const { data: playlistItemData, error: playlistItemError } = await supabase
   .from("playlist_items") 
   .select(`
    *
   `) 
   .eq('playlist_id', playlistId); 

  // 에러 처리
  if (playlistItemError) {
   console.error("플레이리스트 아이템 조회 오류:", playlistItemError);
   throw playlistItemError;
  }
    
    // 2. 데이터 반환
    return playlistItemData;

 } catch (error) {
  console.error("전체 함수 실행 오류:", error);
  return null; 
 }
}