import React, { useState } from "react";
import BasicButton from "../../components/commons/buttons/BasicButton";
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (Vite 방식)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function EditPage() {
  // === 상태 관리 ===
  const [books, setBooks] = useState([]); // 검색된 책 목록
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘
  const [query, setQuery] = useState(""); // 검색어
  
  // 폼 입력 데이터
  const [formData, setFormData] = useState({
    bookId: "", // Google Books API의 book ID 저장
    image: "",
    title: "",
    author: "",
    content: "",
    readDate: "",
    rating: "",
    tags: "",
  });

  // === 구글 책 검색 ===
  const handleSearch = async () => {
    if (!query) return;

    const apiKey = "AIzaSyA1vPxe_5bYtst29GELbF2_-jK3gMmDNBg";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=10`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("검색 실패:", error);
      alert("검색에 실패했습니다.");
    }
  };

  // === 책 선택 시 폼에 자동 입력 ===
  const handleSelectBook = (book) => {
    setFormData({
      ...formData,
      bookId: book.id, // Google Books의 고유 ID 저장
      image: book.volumeInfo.imageLinks?.thumbnail || "",
      title: book.volumeInfo.title || "",
      author: book.volumeInfo.authors?.join(", ") || "",
    });
    // 모달 닫고 초기화
    setIsModalOpen(false);
    setBooks([]);
    setQuery("");
  };

  // === 폼 입력 변경 ===
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // === 저장 버튼 (Books 테이블에 삽입) ===
  const handleSubmit = async () => {
    // 필수 항목 검증
    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }

    try {
      // book_id 생성 (Google Books ID 또는 임시 ID)
      const bookId = formData.bookId || `book_${Date.now()}`;

      // Books 테이블에 삽입
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            book_id: bookId,
            b_title: formData.title,
            author: formData.author,
            cover_image_url: formData.image
          }
        ])
        .select();

      if (error) {
        console.error("Supabase 삽입 에러:", error);
        alert(`저장 실패: ${error.message}`);
        return;
      }

      console.log("삽입 성공:", data);
      alert("책이 성공적으로 저장되었습니다!");

      // 폼 초기화 (선택사항)
      setFormData({
        bookId: "",
        image: "",
        title: "",
        author: "",
        content: "",
        readDate: "",
        rating: "",
        tags: "",
      });

    } catch (error) {
      console.error("저장 중 오류:", error);
      alert("저장에 실패했습니다.");
    }
  };

  // === 공통 input 스타일 ===
  const inputStyle = {
    width: "100%",
    padding: "10px 0",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #333",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      maxWidth: "414px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#000",
      color: "#fff",
      boxSizing: "border-box",
    }}>
      
      {/* === 상단 네비게이션 === */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px",
        paddingBottom: "10px",
        borderBottom: "2px solid #333",
      }}>
        <div style={{ width: "40px" }}></div>
        <span style={{ fontSize: "16px" }}>플레이리스트 책 생성</span>
        <button 
          onClick={handleSubmit}
          style={{ 
            background: "none", 
            border: "none", 
            color: "#fff", 
            fontSize: "16px", 
            cursor: "pointer" 
          }}
        >
          완료
        </button>
      </div>

      {/* === 책 이미지 등록 (클릭 시 검색 모달 오픈) === */}
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          width: "200px",
          height: "280px",
          margin: "0 auto 30px",
          border: "2px solid #333",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: formData.image ? "transparent" : "#111",
          backgroundImage: formData.image ? `url(${formData.image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!formData.image && (
          <>
            <div style={{ color: "#666", fontSize: "14px" }}>이미지를</div>
            <div style={{ color: "#666", fontSize: "14px" }}>등록해 주세요</div>
          </>
        )}
      </div>

      {/* === 책 검색 모달 === */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "400px",
            maxHeight: "80%",
            overflowY: "auto",
          }}>
            
            {/* 모달 헤더 (제목 + 닫기 버튼) */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h2 style={{ color: "#fff", margin: 0 }}>책 검색</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1"
                }}
              >
                ✕
              </button>
            </div>

            {/* 검색창 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="책 제목 입력..."
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              />
              <BasicButton onClick={handleSearch}>검색</BasicButton>
            </div>

            {/* 검색 결과 리스트 */}
            <div>
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #333",
                  }}
                >
                  <div style={{ color: "#fff", marginBottom: "5px" }}>
                    {book.volumeInfo.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "#888" }}>
                    {book.volumeInfo.authors?.join(", ")}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* === 책 정보 입력 폼 === */}
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        
        {/* 제목 */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            제목
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 작가 */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            작가
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 내용 (메모) */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            내용
          </label>
          <input
            type="text"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="책에 대한 간단한 메모..."
            style={inputStyle}
          />
        </div>

        {/* 읽은 날짜 */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
            읽은 날짜
          </label>
          <input
            type="date"
            value={formData.readDate}
            onChange={(e) => handleInputChange("readDate", e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }}
          />
        </div>

        {/* 별점 + 태그 (한 줄에 나란히) */}
        <div style={{ display: "flex", gap: "20px" }}>
          
          {/* 별점 */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
              별점
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              placeholder="1-5"
              style={inputStyle}
            />
          </div>

          {/* 태그 */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
              태그
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="ex) 소설, 추리"
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;