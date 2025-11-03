import CommentBox from "@/components/commons/textBox/CommentBox";   
 
function BookPage(){
    return (
        <div>
            <h1>Book Page</h1>
            <CommentBox 
            text="이 책은 정말 유익합니다. 많은 것을 배울 수 있었어요."
            />
        </div>
    );

}

export default BookPage;

