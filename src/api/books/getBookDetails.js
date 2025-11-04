import { supabase } from "@/api/supabaseClient";

export async function getBookDetails(bookId) {
  try {
    const { data, error } = await supabase
      .from("playlist_items")
      .select(
        `
        item_id,
        user_rating,
        user_comment,
        read_date,
        
        books (
          book_id,
          b_title,
          author,
          cover_image_url
        )
      `
      )
      .eq("book_id", bookId);

    if (error) throw error;

    if (!data || data.length === 0 || !data[0].books) {
      console.log("해당 책에 대한 정보나 리뷰가 없습니다.");
      return { bookInfo: null, reviews: [] };
    }

 
    const bookInfo = {
      id: data[0].books.book_id,
      title: data[0].books.b_title,
      author: data[0].books.author,
      image: data[0].books.cover_image_url,
    };

    const reviews = data.map((item) => ({
      itemId: item.item_id,
      rating: item.user_rating,
      comment: item.user_comment,
      readDate: item.read_date,
    }));

    return { bookInfo, reviews };

  } catch (error) {
    console.error("책 상세정보 불러오기 실패:", error.message);
    throw error;
  }
}