import CommentBox from "@/components/commons/textBox/CommentBox";
import BookMark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookinfo/BookInfo"; 

import React, { useEffect, useState } from "react";

import { getBookDetails } from "@/api/books/getBookDetails";
import { getPlaylistItems } from "@/api/playlistItems/getPlaylistItems";

const BOOK_ID = "1"; // 테스트용 ID

function BookPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState(""); 
  
  const [passages, setPassages] = useState([]); 
  
  const [rating, setRating] = useState(null);
  const [readDate, setReadDate] = useState(null);
  const [bookTags, setBookTags] = useState([]);
  const [displayUserName, setDisplayUserName] = useState(null);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        const [{ bookInfo }, { reviews }] = await Promise.all([
          getBookDetails(BOOK_ID),
          getPlaylistItems(BOOK_ID), 
        ]);

        setBook(
          bookInfo
            ? {
                title: bookInfo.b_title,
                author: bookInfo.author,
                image: bookInfo.cover_image_url,
              }
            : null
        );
        
        const firstReviewItem = reviews && reviews[0]; 

        setCommentText(firstReviewItem?.comment || "");
        
        setPassages(firstReviewItem?.passages || []); 
        
        setRating(firstReviewItem?.rating ?? null);
        setReadDate(firstReviewItem?.readDate ?? null);
        
        const aggregatedTags = Array.from(new Set((reviews || []).flatMap(r => r.tags || [])));
        setBookTags(aggregatedTags);

        const nickname = firstReviewItem?.playlistInfo?.creatorNickname;
        const creatorId = firstReviewItem?.playlistInfo?.creatorId;
        if (nickname) {
          setDisplayUserName(nickname);
        } else if (creatorId) {
          setDisplayUserName(creatorId);
        }

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
            <div className="flex flex-col items-center">
              {displayUserName && (
                <p className="mb-2 font-semibold text-gray-700">
                  @{displayUserName}
                </p>
              )}
              <BookInfo
                title={book.title}
                author={book.author}
                image={book.image}
                rating={rating}
                readDate={readDate}
                tags={bookTags}
              />
            </div>
        )}
      </div>

      <CommentBox text={commentText || "코멘트가 아직 없습니다."} />

      <div className="flex flex-col items-center mt-4">
        {passages.length > 0 ? (
          passages.map((passage) => (
            <BookMark
              key={passage.passage_id} 
              text={passage.passage_text}
            />
          ))
        ) : (
          <BookMark text="저장된 인용구가 없습니다." /> //기본 텍스트
        )}
      </div>
      
    </div>
  );
}

export default BookPage;