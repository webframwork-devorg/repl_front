import React from 'react';

/**
 * @param {object} props
 * @param {string} props.title - 책 제목
 * @param {string} props.author - 저자
 * @param {string} props.image - 책 표지 이미지 URL
 */
function BookInfo({ title, author, image }) {
  
  const displayTitle = title || "제목 없음";
  const displayAuthor = author || "작자 미상";
  const displayImage = image || "https://via.placeholder.com/128x180?text=No+Image";

  return (
    <div className="w-53 h-80 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      
      <div className="w-full ">
        <img
          src={displayImage}
          alt={displayTitle}
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="w-full h-12 p-1 flex flex-col justify-center">
       
        <h3 className="font-bold text-xs truncate" title={displayTitle}>
          {displayTitle}
        </h3>
        <p className="text-gray-600 text-xs truncate" title={displayAuthor}>
          {displayAuthor}
        </p>
      </div>

   </div>
  );
}

export default BookInfo;