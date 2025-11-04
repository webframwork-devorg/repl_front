import React from "react";
import bookmarkBackground from "@/assets/images/bookmark1.svg";
/**
 * @param {object} props - 컴포넌트 props
 * @param {string} props.text - 책갈피로 표시될 텍스트
 */


function BookMark({ text }) {

    const bookmarkStyle= {
        backgroundImage: `url(${bookmarkBackground})`,
    };
     const baseStyle = `mx-4 w-90 h-25 bg-no-repeat bg-contain bg-center flex items-center justify-center p-5 text-black font-bold text-[13px] text-center whitespace-pre-wrap break-keep`;
    return (
        <div className={baseStyle} style={bookmarkStyle}>
            <p>{text}</p>
        </div>
    )
}

export default BookMark;

