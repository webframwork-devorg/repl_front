import { supabase } from "@/api/supabaseClient";

/**
 * 
 * @param {string} bookId - 조회할 책의 ID (ISBN 등)
 */

export async function getBookDetails(bookId) {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(
        `
        book_id,
        b_title,
        author,
        cover_image_url
      `
      )
      .eq("book_id", bookId)
      .single(); 

    if (error) {
      if (error.code === 'PGRST116') { 
        console.log("해당 book_id의 책을 찾을 수 없습니다.");
        return { bookInfo: null };
      }
      throw error;
    }

    return { bookInfo: data };

  } catch (error) {
    console.error("책 정보 불러오기 실패:", error.message);
    throw error;
  }
}