import CommentBox from "@/components/commons/textBox/CommentBox";
import Bookmark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookInfo/BookInfo";
import { getBookDetails } from "@/api/books/getBookDetails";
import { getPlaylistItems } from "@/api/playlists/getPlaylistItems";

import heartIcon from "@/assets/images/heart.svg";
import emptyHeartIcon from "@/assets/images/emptyHeart.svg";
import plusIcon from "@/assets/images/plus.svg";
import { IoMdArrowRoundBack } from "react-icons/io";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialReviewState = {
  comment: "",
  passages: [],
  rating: null,
  readDate: null,
  tags: [],
  userName: "작성자 정보 없음", 
  playlistId: null,
};

function BookPage() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [review, setReview] = useState(initialReviewState);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        const [{ bookInfo }, { reviews }] = await Promise.all([
          getBookDetails(id),
          getPlaylistItems(id),
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
          });
        } else {
          setReview(initialReviewState);
        }
      } catch (error) {
        console.error("Failed to load book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBookData();
    }
  }, [id]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
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

      {/* 북마크 */}
      <div className="w-full h-5 flex justify-center">
        <div className="w-95 flex justify-between items-center px-4 py-2">
          <p className="font-semibold text-[#828282] text-sm">
            책갈피: {review.passages.length}개
          </p>

          <div className="flex space-x-2">
            <button
              className="p-1 transition-transform hover:scale-110"
              onClick={toggleLike}
            >
              <img
                src={isLiked ? heartIcon : emptyHeartIcon}
                alt="좋아요"
                className="w-5 h-5"
              />
            </button>
            <button className="p-1 transition-transform hover:scale-110">
              <img src={plusIcon} alt="책갈피 추가" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {review.passages.length > 0 ? (
          review.passages.map((passage) => (
            <Bookmark
              key={passage.passage_id}
              text={passage.passage_text}
              pageNumber={passage.page_number}
              backgroundId={passage.background_id}
            />
          ))
        ) : (
          <Bookmark text="저장된 인용구가 없습니다." />
        )}
      </div>
    </div>
  );
}

export default BookPage;