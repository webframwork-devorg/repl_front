import CommentBox from "@/components/commons/textBox/CommentBox";
import Bookmark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookInfo/BookInfo";
import { getBookDetails } from "@/api/books/getBookDetails";
import { getPlaylistItems } from "@/api/playlists/getPlaylistItems";

import HeartPlusButton from "@/components/commons/buttons/HeartPlusButton";
import AddBookmarkModal from "@/components/commons/modals/AddBookmarkModal";

import { IoMdArrowRoundBack } from "react-icons/io";

// 1. useCallback import 추가
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialReviewState = {
  comment: "",
  passages: [],
  rating: null,
  readDate: null,
  tags: [],
  userName: "작성자 정보 없음",
  playlistId: null,
  playlistItemId: null,
};

function BookPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [review, setReview] = useState(initialReviewState);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadBookData = useCallback(async () => {
    if (!bookId) return; 
    
    try {
      setLoading(true);
      const [bookData, playlistData] = await Promise.all([
        getBookDetails(bookId),
        getPlaylistItems(bookId),
      ]);

      const bookInfo = bookData?.bookInfo ?? {};
      const reviews = playlistData?.reviews ?? [];

      setBook(
        bookInfo.b_title
          ? {
              title: bookInfo.b_title,
              author: bookInfo.author,
              image: bookInfo.cover_image_url,
            }
          : null
      );

      const firstReviewItem = reviews && reviews[0];

      if (firstReviewItem) {
        const nickname = firstReviewItem.playlistInfo?.creatorNickname;
        const userId = firstReviewItem.playlistInfo?.creatorId;

        setReview({
          comment: firstReviewItem.comment || "",
          passages: firstReviewItem.passages || [],
          rating: firstReviewItem.rating ?? null,
          readDate: firstReviewItem.readDate ?? null,
          tags: firstReviewItem.tags || [],
          userName: nickname || userId || "작성자 정보 없음",
          playlistId: firstReviewItem.playlistInfo?.id || null, 
          playlistItemId: firstReviewItem.itemId || null,
        });
      } else {
        setReview(initialReviewState);
      }
    } catch (error) {
      console.error("Failed to load book:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId]); // id가 변경될 때만 함수 새로 생성

  useEffect(() => {
    loadBookData();
  }, [loadBookData]); 

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };
  
  const handlePlusClick = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadBookData(); 
  };

  const handleGoBack = () => {
    if (review.playlistId) {
      navigate(`/list/${review.playlistId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <button
        onClick={handleGoBack}
        className="px-4 py-2 text-[20px] font-semibold text-white transition-opacity hover:opacity-75"
      >
        <IoMdArrowRoundBack />
      </button>

      {/* BookInfo */}
      <div className="w-full flex justify-center ">
        {loading && (
          <div className="w-32 h-32 flex items-center justify-center">
            로딩...
          </div>
        )}
        {!loading && book && (
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-[14px] font-bold text-white">
              {book.title}
            </h2>
            {review.userName && (
              <p className="mb-2 text-[11px] font-semibold text-[#828282]">
                @{review.userName}
              </p>
            )}
            <BookInfo
              title={book.title}
              author={book.author}
              image={book.image}
              rating={review.rating}
              readDate={review.readDate}
              tags={review.tags}
            />
          </div>
        )}
      </div>

      {/* CommentBox */}
      <div className="w-full flex justify-center my-4">
        <CommentBox text={review.comment || "코멘트가 아직 없습니다."} />
      </div>

      {/* 북마크 영역 */}
      <div className="w-full h-5 flex justify-center">
        <div className="w-95 flex justify-between items-center px-4 py-2">
          <p className="font-semibold text-[#828282] text-sm">
            책갈피: {review.passages.length}개
          </p>
          <HeartPlusButton
            isLiked={isLiked}
            onHeartClick={handleLikeToggle}
            onPlusClick={handlePlusClick} 
          />
        </div>
      </div>

      {/* Bookmark 목록 */}
      <div className="flex flex-col items-center">
        {review.passages.length > 0 ? (
          review.passages.map((passage, index) => (
            <Bookmark
              key={passage.passage_id ?? index}
              text={passage.passage_text}
              pageNumber={passage.page_number}
              backgroundId={passage.background_id}
            />
          ))
        ) : (
          <Bookmark text="저장된 인용구가 없습니다." />
        )}
      </div>
      
      {/* 모달 */}
      {isModalOpen && (
        <AddBookmarkModal
          playlistItemId={review.playlistItemId}
          onClose={handleCloseModal}
        />
      )}
      
    </div>
  );
}

export default BookPage;