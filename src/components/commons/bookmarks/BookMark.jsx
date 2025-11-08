import React from "react";

import blueBg from "@/assets/images/bookmark-blue.svg";
import noteBg from "@/assets/images/bookmark-note.svg";
import pinkBg from "@/assets/images/bookmark-pink.svg";
import OrangeBg from "@/assets/images/bookmark-orange.svg";
import whiteBg from "@/assets/images/bookmark-white.svg";

const bookmarkBackgrounds = {

  1: whiteBg,   // ID 1번: 흰색
  4: blueBg,    // ID 4번: 파란색
  2: pinkBg,     // ID 2번: 분홍색
  3: OrangeBg,  // ID 3번: 주황색
  5: noteBg,    // ID 5번: 노트배경
};

/**
 * @param {object} props - 컴포넌트 props
 * @param {string} props.text - 책갈피로 표시될 텍스트
 * @param {string} props.pageNumber - 페이지 번호
 * @param {number} props.backgroundId - 배경 ID (1, 2, 3...)
 */
function Bookmark({ text, pageNumber, backgroundId }) { 

    //기본값 1번(파란색)
    const selectedBg = bookmarkBackgrounds[backgroundId] || bookmarkBackgrounds[1];

    const bookmarkStyle= {
        backgroundImage: `url(${selectedBg})`, 
    };

    const baseStyle = `mx-4 w-90 h-25 bg-no-repeat bg-contain bg-center flex items-center justify-start p-5 text-black font-bold text-[13px] text-start whitespace-pre-wrap break-keep`;
    
    return (
        <div className={baseStyle} style={bookmarkStyle}>
            <div>
                {pageNumber && (
                    <p className="text-[14px] font-medium opacity-80 mb-1">
                        {pageNumber}P
                    </p>
                )}
                <p>"{text}"</p>
            </div>
        </div>
    )
}

export default Bookmark;