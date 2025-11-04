import { supabase } from "@/api/supabaseClient";

/**
 * 새 플레이리스트 등록 (썸네일 업로드 + 태그 연결)
 *
 * @param {Object} payload
 * @param {Object} payload.user - 로그인한 유저 객체 (user.id 필수)
 * @param {string} payload.title - 플레이리스트 제목
 * @param {string} payload.summary - 한 줄 설명
 * @param {Object} payload.image - { type: 'file' | 'url', file?: File, url?: string }
 * @param {Array} payload.tags - 선택된 태그 배열 (id, tag_id, tag_name 등 다양한 형태 가능)
 */
export async function postPlayList({ user, title, summary, image, tags }) {
  try {
    let thumbnailUrl = image?.url || "";

    if (image?.type === "file" && image.file) {
      const fileName = `${Date.now()}_${image.file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, image.file);

      if (uploadError) throw uploadError;

      thumbnailUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/thumbnails/${fileName}`;
    }

    const { data: playlistData, error: playlistError } = await supabase
      .from("playlists")
      .insert([
        {
          user_id: user.id,
          p_title: title,
          summary,
          thumbnail_url: thumbnailUrl,
          like_count: 0,
        },
      ])
      .select()
      .single();

    if (playlistError) throw playlistError;

    const playlistId = playlistData.playlist_id;
    console.log("새 플레이리스트 등록 성공:", playlistData);

    if (tags && tags.length > 0) {
      const validTags = tags
        .map((t) => {
          if (typeof t === "number") return t;
          if (t?.tag_id) return t.tag_id;
          if (t?.id) return t.id;
          return null;
        })
        .filter((id) => Number.isInteger(id));

      if (validTags.length === 0) {
        console.warn("유효한 태그 없음 (모두 null 또는 잘못된 값)");
      } else {
        const tagInserts = validTags.map((tagId) => ({
          playlist_id: playlistId,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from("playlist_tags")
          .insert(tagInserts);

        if (tagError) throw tagError;
        console.log("태그 연결 완료:", tagInserts);
      }
    } else {
      console.log("선택된 태그 없음");
    }

    console.log("플레이리스트 등록 전체 완료!");
    return { success: true, data: playlistData };
  } catch (error) {
    console.error("플레이리스트 등록 오류:", error.message || error);
    return { success: false, error };
  }
}
