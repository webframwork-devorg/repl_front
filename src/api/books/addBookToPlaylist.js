// /api/books/addBookToPlaylist.js
import { supabase } from "@/api/supabaseClient";

/**
 * 플레이리스트에 책 추가
 * @param {Object} params
 * @param {number} params.playlistId - 플레이리스트 ID
 * @param {string} params.title - 책 제목
 * @param {string} params.author - 저자
 * @param {string} params.image - 표지 이미지 URL
 * @param {string} params.content - 한줄평
 * @param {string} params.readDate - 읽은 날짜
 * @param {number} params.rating - 별점
 */
export async function addBookToPlaylist({
  playlistId,
  title,
  author,
  image,
  content,
  readDate,
  rating,
}) {
  try {
    // 1단계: 다음 book_id 계산
    const { data: allBooks } = await supabase.from("books").select("book_id");

    const numericIds =
      allBooks
        ?.map((book) => parseInt(book.book_id))
        .filter((id) => !isNaN(id)) || [];

    let nextBookId =
      numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    // 2단계: book_id 중복 체크
    let bookIdExists = true;

    while (bookIdExists) {
      const { data: existingBook } = await supabase
        .from("books")
        .select("book_id")
        .eq("book_id", nextBookId.toString())
        .maybeSingle();

      if (existingBook) {
        nextBookId++;
      } else {
        bookIdExists = false;
      }
    }

    // 3단계: books 테이블에 책 정보 저장
    const { error: bookError } = await supabase.from("books").insert({
      book_id: nextBookId.toString(),
      b_title: title,
      author: author,
      cover_image_url: image,
    });

    if (bookError) {
      throw new Error(`책 저장 실패: ${bookError.message}`);
    }

    // 4단계: playlist_items 테이블에 연결 정보 저장
    const { data: itemData, error: itemError } = await supabase
      .from("playlist_items")
      .insert({
        playlist_id: playlistId,
        book_id: nextBookId.toString(),
        user_rating: rating ? parseFloat(rating) : null,
        user_comment: content || null,
        read_date: readDate || null,
      })
      .select()
      .single();

    if (itemError) {
      throw new Error(`플레이리스트 추가 실패: ${itemError.message}`);
    }

    return {
      success: true,
      data: {
        bookId: nextBookId.toString(),
        itemId: itemData.item_id,
      },
    };
  } catch (error) {
    console.error("책 추가 오류:", error);
    return {
      success: false,
      error: error.message || "알 수 없는 오류",
    };
  }
}