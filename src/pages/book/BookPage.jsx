import CommentBox from "@/components/commons/textBox/CommentBox";
import Bookmark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookInfo/BookInfo";
import HeartPlusButton from "@/components/commons/buttons/HeartPlusButton";
import AddBookmarkModal from "@/components/commons/modals/AddBookmarkModal";
import { IoMdArrowRoundBack } from "react-icons/io";

import { supabase } from "@/api/supabaseClient"; 
import { getBookDetails } from "@/api/books/getBookDetails";
import { getPlaylistItems } from "@/api/playlists/getPlaylistItems";

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialReviewState = {
  comment: "",
  passages: [],
  rating: null,
  readDate: null,
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
  const [isLikeLoading, setIsLikeLoading] = useState(false); 
  const [review, setReview] = useState(initialReviewState);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  const loadBookData = useCallback(async () => {
    if (!bookId) return; 
    
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

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
        const itemId = firstReviewItem.itemId;

        setReview({
          comment: firstReviewItem.comment || "",
          passages: firstReviewItem.passages || [],
          rating: firstReviewItem.rating ?? null,
          readDate: firstReviewItem.readDate ?? null,
          userName: nickname || userId || "작성자 정보 없음",
          playlistId: firstReviewItem.playlistInfo?.id || null, 
          playlistItemId: itemId || null,
        });

        if (user && itemId) {
          const { data: likeData } = await supabase
            .from("user_playlistitem_likes")
            .select("*")
            .match({ user_id: user.id, item_id: itemId })
            .maybeSingle();
          
          setIsLiked(!!likeData);
        }

      } else {
        setReview(initialReviewState);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Failed to load book:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBookData();
  }, [loadBookData]); 

  const handleLikeToggle = async () => {
    if (isLikeLoading) return;
    if (!currentUser || !review.playlistItemId) {
      alert("로그인이 필요하거나 아이템 정보를 찾을 수 없습니다.");
      return;
    }

    setIsLikeLoading(true);
    const originalIsLiked = isLiked;
    
    setIsLiked(!originalIsLiked); 

    try {
      if (!originalIsLiked) {
        // 좋아요 추가
        await supabase
          .from("user_playlistitem_likes")
          .insert({ user_id: currentUser.id, item_id: review.playlistItemId });
      } else {
        // 좋아요 삭제
        await supabase
          .from("user_playlistitem_likes")
          .delete()
          .match({ user_id: currentUser.id, item_id: review.playlistItemId });
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
      setIsLiked(originalIsLiked); // 실패 시 원상 복구
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  const handlePlusClick = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadBookData(); // 모달 닫으면 데이터 새로고침
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
          <div className="w-32 h-32 flex items-center justify-center text-white">
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
          
          {/* HeartPlusButton에 함수와 상태 전달 */}
          <HeartPlusButton
            isLiked={isLiked}
            onHeartClick={handleLikeToggle}
            onPlusClick={handlePlusClick} 
          />
        </div>
      </div>

      {/* Bookmark 목록 */}
      <div className="flex flex-col items-center mt-4">
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