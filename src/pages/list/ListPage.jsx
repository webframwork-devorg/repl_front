import QuoteBox from "@/components/commons/quoteBox/QuoteBox";

function ListPage() {
  const quoteText = "너는 지금 어떻게 지내? 넌 내 좋은 추억이었어";
  const baseStyle = "bg-black min-h-screen";

  return (
    <div className={baseStyle}>
      < QuoteBox
        text={quoteText}
        className="max-w-[600px] mx-auto mt-20 text-center" 
     />
    </div>
  ); 
}

export default ListPage;
