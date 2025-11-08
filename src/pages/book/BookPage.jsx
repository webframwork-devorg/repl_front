import CommentBox from "@/components/commons/textBox/CommentBox";
import Bookmark from "@/components/commons/bookmarks/Bookmark";
import BookInfo from "@/components/commons/bookInfo/BookInfo";
import { getBookDetails } from "@/api/books/getBookDetails";
import { getPlaylistItems } from "@/api/playlists/getPlaylistItems";

import heartIcon from "@/assets/images/heart.svg";
import emptyHeartIcon from "@/assets/images/emptyHeart.svg"; 
import plusIcon from "@/assets/images/plus.svg";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BookPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState(""); 
  const [passages, setPassages] = useState([]); 
  const [rating, setRating] = useState(null);
  const [readDate, setReadDate] = useState(null);
  const [bookTags, setBookTags] = useState([]);
  const [displayUserName, setDisplayUserName] = useState(null);
  const [isLiked, setIsLiked] = useState(false); 

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
           
          setCommentText(firstReviewItem.comment || "");
          setPassages(firstReviewItem.passages || []); 
          setRating(firstReviewItem.rating ?? null);
          setReadDate(firstReviewItem.readDate ?? null);
          setBookTags(firstReviewItem.tags || []);

          const nickname = firstReviewItem.playlistInfo?.creatorNickname;
          const userId = firstReviewItem.playlistInfo?.creatorId;
           
          setDisplayUserName(nickname || userId || "작성자 정보 없음");
        
        } else {
           // 리뷰가 없을 때 처리 
          setDisplayUserName("작성자 정보 없음");
          setCommentText("");
          setPassages([]);
          setRating(null);
          setReadDate(null);
          setBookTags([]);
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
    // ListPage로 이동
    navigate('/ListPage'); 

  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <button
        onClick={handleGoBack}
        className="px-4 py-2 text-[20px] font-semibold text-white transition-opacity hover:opacity-75"
      >
        ←
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

            {displayUserName && (
              <p className="mb-2 text-[11px] font-semibold text-[#828282]">
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

      {/* CommentBox */}
      <div className="w-full flex justify-center my-4">
        <CommentBox text={commentText || "코멘트가 아직 없습니다."} />
      </div>

      {/* 북마크 */}
      <div className="w-full h-5 flex justify-center">
        <div className="w-95 flex justify-between items-center px-4 py-2">
          <p className="font-semibold text-[#828282] text-sm">
            책갈피: {passages.length}개
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
        {passages.length > 0 ? (
          passages.map((passage) => (
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