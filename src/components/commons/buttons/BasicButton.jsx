import React from "react";

/**
// 블랙 버튼
// 화이트 버튼

@param {object} props - 컴포넌트 props
@param {React.ReactNode} props.children - 버튼 안에 들어갈 내용
@param {"black" | "white"} [props.variant="black"] - 버튼 스타일 (기본값: black)
@param {function} [props.onClick] - 버튼 클릭 이벤트 핸들러
*/

function BasicButton({ children, variant = "black", onClick }) {
  const baseStyle = "w-full h-full rounded-[15px] text-[16px]";

  const variants = {
    black: "bg-black text-white font-bold hover:bg-gray-800",
    white:
      "bg-white text-black font-bold font-inter",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default BasicButton;
