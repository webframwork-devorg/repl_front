import QuoteBox from "@/components/commons/textBox/QuoteBox";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

function ListPage() {
  const quoteText = "너는 지금 어떻게 지내? 넌 내 좋은 추억이었어";
  const baseStyle = "bg-black min-h-screen";

  const menuItems = [
    { icon: <FaPencilAlt />, label: "수정", path: "/edit" },
    { icon: <FaTrash />, label: "삭제", path: "/delete" },
  ];

  return (
    <>
    <div className={baseStyle}>
      < QuoteBox
       text={quoteText}
       className="max-w-[600px] mx-auto mt-20 text-center" 
     />
      <FloatingMenu menuItems={menuItems}/>
    </div>
    </>
  ); 
}

export default ListPage;
