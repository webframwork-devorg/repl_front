import React, { useState } from 'react';
import defaultBookImage from "@/assets/images/no-image.svg";
//책 정보 연결

/**
 * @param {object} props
 * @param {string} props.title - 책 제목
 * @param {string} props.author - 저자
 * @param {string} props.image - 책 표지 이미지 URL
 * @param {number} props.rating - 별점
 * @param {string} props.readDate - 읽은 날짜
 */
function BookInfo({ title, author, image, rating, readDate }) {

  const [isFlipped, setIsFlipped] = useState(false);
  
  const displayTitle = title || "제목 없음";
  const displayAuthor = author || "작자 미상";
  const displayImage = image || defaultBookImage;  
  const displayRating = rating ? `⭐ ${rating}` : "평가 없음";
  const displayReadDate = readDate || "날짜 미지정";

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-53 h-80 [perspective:1000px] cursor-pointer"
      onClick={handleFlip}
    >
      <div 
        className={`
          relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-cover rounded-lg shadow-md" 
          />
        </div>
        
        <div 
          className="
            absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]
            bg-white rounded-lg shadow-md p-4 
            flex flex-col justify-center items-center text-center
            overflow-auto /* 텍스트가 많을 경우 스크롤 */
          "
        >
          <h3 className="font-bold text-sm" title={displayTitle}>
            {displayTitle}
          </h3>

          <p className="text-gray-600 text-xs mt-1" title={displayAuthor}>
            {displayAuthor}
          </p>
          
          <hr className="my-2 w-3/4" />


          <p className="font-semibold text-yellow-500 text-xs">
            {displayRating}
          </p>

          <p className="text-gray-500 text-xs mt-1">
            {displayReadDate}
          </p>

        </div>

      </div>
    </div>
  );
}

export default BookInfo;