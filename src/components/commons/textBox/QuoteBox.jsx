import React from "react";

/**
 * @param {object} props - 컴포넌트 props
 * @param {string} props.text - 인용구로 표시될 텍스트
 */

function QuoteBox({ text, className = "" }) {
  const baseStyle = "w-full p-4 rounded-[15px] border border-white bg-black text-white text-center font-bold text-[15px]";
  
  return (
    <div className={`${baseStyle} ${className}`}>
        “{text}”
    </div>
  );
}

export default QuoteBox;