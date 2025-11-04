import CommentBox from "@/components/commons/textBox/CommentBox";
import BookMark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookinfo/BookInfo";

import React, { useEffect, useState } from "react";
import { getBookDetails } from "@/api/books/getbookdetails"; // 1-2. API 함수

const BOOK_ID = "1";

function BookPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        const { bookInfo } = await getBookDetails(BOOK_ID);
        setBook(bookInfo);
      } catch (error) {
        console.error("Failed to load book:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookData();
  }, []);

  return (
    <div>
      <h1>Book Page</h1>

      <div className="w-full flex justify-center my-4">
        {loading && <div className="w-32 h-32 flex items-center justify-center">로딩...</div>}
        {!loading && book && (
          <BookInfo
            title={book.title}
            author={book.author}
            image={book.image}
          />
        )}
      </div>

      <CommentBox text="이 책은 정말 유익합니다. 많은 것을 배울 수 있었어요." />

      <BookMark text="중요한 부분을 북마크했습니다.중요한 부분을 북마크했습니다.중요한 부분을 북마크했습니다." />
    </div>
  );
}

export default BookPage;