import QuoteBox from "@/components/commons/textBox/QuoteBox";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import ThumbnailCard from "@/components/commons/card/ThumbnailCard";
import HeartShareButton from "@/components/commons/buttons/HeartShareButton";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useState } from "react";

function ListPage() {
  const quoteText = "너는 지금 어떻게 지내? 넌 내 좋은 추억이었어";
  const baseStyle = "bg-black min-h-screen";

  const [isLiked, setIsLiked] = useState(false);

  const menuItems = [
    { icon: <FaPencilAlt />, label: "수정", path: "/edit" },
    { icon: <FaTrash />, label: "삭제", path: "/delete" },
  ];

  // 1. 하트 버튼 로직 (API 연동 없이 상태만 변경)
  const handleLikeToggle = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  const handleShare = () => {
    // 예: 웹 표준 공유 API 사용
    if (navigator.share) {
      navigator
        .share({
          title: "게시물 제목",
          text: "이 게시물을 확인해보세요!",
          url: window.location.href,
        })
        .then(() => console.log("공유 성공"))
        .catch((error) => console.log("공유 실패", error));
    } else {
      // 공유 API 미지원 시 (예: PC) 클립보드 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <>
    <div className={baseStyle}>
      < QuoteBox
       text={quoteText}
       className="max-w-[600px] mx-auto text-center" 
     />
      <FloatingMenu />
      <ThumbnailCard 
      title = {quoteText}
      />
    </div>
    <div className="fixed bottom-28 right-10">
      <HeartShareButton
        isLiked={isLiked}
        onHeartClick={handleLikeToggle} // 하트 로직 연결
        onShareClick={handleShare} // 공유 로직 연결
      />
    </div>
    </>
  ); 
}

export default ListPage;
