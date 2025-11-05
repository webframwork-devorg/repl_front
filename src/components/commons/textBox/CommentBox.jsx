import React from "react";

/**
 * @param {object} props - 컴포넌트 props
 * @param {string} props.text - 인용구로 표시될 텍스트
 */

function CommentBox({ text, className = "" }) {
  const baseStyle = "mx-4 w-90 px-[30px] py-[20px] text-center rounded-[10px] border border-white bg-black text-white font-bold text-[12px]";
  
  return (
    <div className={`${baseStyle} ${className}`}>
        {text}
    </div>
  );
}

export default CommentBox;