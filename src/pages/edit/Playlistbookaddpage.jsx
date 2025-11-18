import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicButton from "../../components/commons/buttons/BasicButton";
import TextArea from "../../components/commons/inputs/TextArea";
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
// 환경 변수에서 URL과 API 키를 가져와 데이터베이스 연결 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * PlaylistBookAddPage 컴포넌트
 * 
 * 기능:
 * 1. Google Books API를 통해 책 검색
 * 2. 검색한 책을 선택하면 제목/작가가 자동 입력됨
 * 3. 추가 정보(별점, 코멘트, 읽은 날짜) 입력
 * 4. books 테이블과 playlist_items 테이블에 데이터 저장
 * 
 * URL 파라미터: /list/:id/book/add
 * - id: 현재 플레이리스트의 ID
 */
function PlaylistBookAddPage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const { id } = useParams(); // URL에서 플레이리스트 ID 추출 (예: /list/3/book/add → id = "3")
  
  // ==================== State 관리 ====================
  
  // 검색 결과로 받은 책 목록을 저장하는 state
  const [books, setBooks] = useState([]);
  
  // 책 검색 모달의 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 책 검색어 (사용자가 입력한 검색 키워드)
  const [query, setQuery] = useState("");
  
  // 책 정보와 사용자 입력 데이터를 저장하는 폼 데이터
  const [formData, setFormData] = useState({
    image: "",      // 책 표지 이미지 URL
    title: "",      // 책 제목
    author: "",     // 책 저자
    content: "",    // 사용자가 작성한 코멘트
    readDate: "",   // 책을 읽은 날짜
    rating: "",     // 별점 (0-5)
  });

  // ==================== 책 검색 함수 ====================
  
  /**
   * Google Books API를 호출하여 책을 검색하는 함수
   * 
   * 동작 순서:
   * 1. 검색어(query)가 비어있으면 아무것도 안 함
   * 2. Google Books API에 GET 요청
   * 3. 검색 결과를 books state에 저장
   */
  const handleSearch = async () => {
    if (!query) return; // 검색어가 없으면 함수 종료
    
    // Google Books API 키와 URL 설정
    const apiKey = "AIzaSyA1vPxe_5bYtst29GELbF2_-jK3gMmDNBg";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=10`;

    try {
      // API 호출
      const response = await fetch(url);
      const data = await response.json();
      
      // 검색 결과를 state에 저장 (결과가 없으면 빈 배열)
      setBooks(data.items || []);
    } catch (error) {
      // 검색 실패 시 알림
      alert("검색에 실패했습니다.");
    }
  };

  // ==================== 책 선택 함수 ====================
  
  /**
   * 검색 결과에서 책을 선택했을 때 실행되는 함수
   * 
   * 동작:
   * 1. 선택한 책의 정보(이미지, 제목, 저자)를 추출
   * 2. formData state를 업데이트하여 입력 필드에 자동 입력
   * 3. 모달 닫기 및 검색 상태 초기화
   * 
   * @param {Object} book - Google Books API에서 받은 책 객체
   */
  const handleSelectBook = (book) => {
    // 책 정보를 formData에 저장
    setFormData({
      ...formData, // 기존 formData 유지 (content, readDate, rating 등)
      image: book.volumeInfo.imageLinks?.thumbnail || "", // 썸네일 이미지 (없으면 빈 문자열)
      title: book.volumeInfo.title || "",                 // 책 제목
      author: book.volumeInfo.authors?.join(", ") || "",  // 저자 (여러 명이면 쉼표로 연결)
    });
    
    // 모달 닫고 검색 상태 초기화
    setIsModalOpen(false); // 모달 닫기
    setBooks([]);          // 검색 결과 비우기
    setQuery("");          // 검색어 비우기
  };

  // ==================== 책 저장 함수 ====================
  
  /**
   * "완료" 버튼을 클릭했을 때 실행되는 함수
   * 
   * 동작 순서:
   * 1. 필수 입력값(제목) 검증
   * 2. books 테이블에서 다음 book_id 계산 (1, 2, 3... 순차적)
   * 3. 중복 book_id가 있는지 확인하고 없을 때까지 +1
   * 4. books 테이블에 책 정보 저장
   * 5. playlist_items 테이블에 플레이리스트-책 연결 정보 저장
   * 6. 저장 성공 시 플레이리스트 페이지로 이동
   */
  const handleSubmit = async () => {
    // === 1단계: 입력값 검증 ===
    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return; // 제목이 없으면 함수 종료
    }

    try {
      // URL 파라미터에서 가져온 플레이리스트 ID를 숫자로 변환
      const playlistId = parseInt(id);

      // === 2단계: 다음 book_id 계산 ===
      // books 테이블에서 모든 book_id를 조회
      const { data: allBooks } = await supabase.from('books').select('book_id');
      
      // book_id를 숫자로 변환하고, 숫자가 아닌 것은 제외
      // 예: ["1", "2", "abc", "3"] → [1, 2, 3]
      const numericIds = allBooks
        ?.map(book => parseInt(book.book_id))  // 문자열을 숫자로 변환
        .filter(id => !isNaN(id)) || [];       // NaN(숫자가 아닌 값) 제외
      
      // 가장 큰 book_id에 +1 (book_id가 없으면 1부터 시작)
      // 예: [1, 2, 3] → 4, [] → 1
      let nextBookId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

      // === 3단계: book_id 중복 체크 및 회피 ===
      // 동시에 여러 사용자가 추가하는 경우를 대비하여
      // 계산한 book_id가 이미 존재하는지 한 번 더 확인
      let bookIdExists = true; // 중복 여부를 추적하는 플래그
      
      while (bookIdExists) {
        // 해당 book_id가 이미 존재하는지 조회
        const { data: existingBook } = await supabase
          .from('books')
          .select('book_id')
          .eq('book_id', nextBookId.toString()) // book_id는 문자열로 저장됨
          .maybeSingle(); // 결과가 없어도 에러가 발생하지 않음
        
        if (existingBook) {
          // 이미 존재하면 다음 번호로 증가
          nextBookId++;
        } else {
          // 존재하지 않으면 루프 종료
          bookIdExists = false;
        }
      }

      // === 4단계: books 테이블에 책 정보 저장 ===
      const { error: bookError } = await supabase
        .from('books')
        .insert({
          book_id: nextBookId.toString(),    // 책 고유 ID (문자열)
          b_title: formData.title,           // 책 제목
          author: formData.author,           // 저자
          cover_image_url: formData.image    // 표지 이미지 URL
        });

      // books 저장 실패 시 에러 처리
      if (bookError) {
        alert(`책 저장 실패: ${bookError.message}`);
        return; // 함수 종료 (더 이상 진행하지 않음)
      }

      // === 5단계: playlist_items 테이블에 연결 정보 저장 ===
      // 이 테이블은 "어느 플레이리스트에 어떤 책이 들어있는지" 연결하는 역할
      const { error: itemError } = await supabase
        .from('playlist_items')
        .insert({
          playlist_id: playlistId,                                    // 플레이리스트 ID
          book_id: nextBookId.toString(),                             // 책 ID
          user_rating: formData.rating ? parseFloat(formData.rating) : null,  // 별점 (입력 안 하면 null)
          user_comment: formData.content || null,                     // 코멘트 (입력 안 하면 null)
          read_date: formData.readDate || null,                       // 읽은 날짜 (입력 안 하면 null)
        });

      // playlist_items 저장 실패 시 에러 처리
      if (itemError) {
        alert(`플레이리스트 추가 실패: ${itemError.message}`);
        return; // 함수 종료
      }

      // === 6단계: 저장 성공 시 처리 ===
      // 모든 작업이 성공했을 때만 이 코드가 실행됨
      alert("책이 플레이리스트에 추가되었습니다!");
      navigate(`/list/${id}`); // 플레이리스트 상세 페이지로 이동

    } catch (error) {
      // 예상치 못한 에러 발생 시
      alert("저장에 실패했습니다.");
    }
  };

  // ==================== UI 렌더링 ====================
  
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ========== 상단 네비게이션 바 ========== */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-800">
          {/* 닫기 버튼: 플레이리스트 페이지로 돌아가기 */}
          <button 
            onClick={() => navigate(`/list/${id}`)}
            className="text-white hover:text-gray-300 transition-colors text-base sm:text-lg"
          >
            닫기
          </button>
          
          {/* 페이지 제목 */}
          <span className="text-base sm:text-lg font-medium">책 추가</span>
          
          {/* 완료 버튼: 책 정보를 DB에 저장 */}
          <button 
            onClick={handleSubmit}
            className="text-white hover:text-gray-300 transition-colors text-base sm:text-lg font-medium"
          >
            완료
          </button>
        </div>

        {/* ========== 반응형 그리드 레이아웃 ========== */}
        {/* 
          큰 화면(lg 이상): 2열 그리드 (이미지 | 입력 폼)
          작은 화면: 1열 그리드 (이미지 위에 입력 폼 아래)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ========== 왼쪽 섹션: 책 표지 이미지 ========== */}
          <div className="flex flex-col items-center lg:items-start">
            {/* 
              이미지 박스 클릭 시 책 검색 모달 열림
              3:4 비율 유지, 최대 너비 320px (모바일) 또는 full (데스크탑)
            */}
            <div 
              onClick={() => setIsModalOpen(true)} // 클릭 시 모달 열기
              className="w-full aspect-[3/4] max-w-[320px] lg:max-w-full border-2 border-gray-700 rounded-2xl flex items-center justify-center bg-[#0d0d0d] hover:border-white cursor-pointer transition-all duration-300 overflow-hidden"
            >
              {/* 이미지가 없을 때: 안내 메시지 표시 */}
              {!formData.image ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">클릭하여</p>
                    <p className="text-lg">책을 검색하세요</p>
                  </div>
                </div>
              ) : (
                // 이미지가 있을 때: 책 표지 이미지 표시
                <div className="relative w-full h-full group">
                  <img 
                    src={formData.image} 
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* 호버 시 나타나는 오버레이 */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">다른 책 검색</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== 오른쪽 섹션: 입력 폼 ========== */}
          <div className="flex flex-col gap-6">
            
            {/* 제목 입력 필드 */}
            <div>
              <label className="block mb-2 text-[18px] font-bold text-white">
                제목
              </label>
              <input
                type="text"
                value={formData.title} // formData의 title 값과 양방향 바인딩
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="책 제목을 입력하세요"
                maxLength={100}
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            {/* 작가 입력 필드 */}
            <div>
              <label className="block mb-2 text-[18px] font-bold text-white">
                작가
              </label>
              <input
                type="text"
                value={formData.author} // formData의 author 값과 양방향 바인딩
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="작가명을 입력하세요"
                maxLength={50}
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            {/* 코멘트 입력 필드 (TextArea 컴포넌트 사용) */}
            <TextArea
              label="내용"
              maxLength={500}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />

            {/* 읽은 날짜 & 별점 입력 (2열 그리드) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* 읽은 날짜 입력 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  읽은 날짜
                </label>
                <input
                  type="date" // 날짜 선택 input
                  value={formData.readDate}
                  onChange={(e) => setFormData({ ...formData, readDate: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  style={{ colorScheme: "dark" }} // 다크 모드 캘린더 UI
                />
              </div>

              {/* 별점 입력 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  별점 (0-5)
                </label>
                <input
                  type="number" // 숫자 입력 input
                  min="0"       // 최소값 0
                  max="5"       // 최대값 5
                  step="0.5"    // 0.5 단위로 입력 가능 (0, 0.5, 1, 1.5, ...)
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="0.0"
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== 책 검색 모달 ========== */}
        {/* isModalOpen이 true일 때만 렌더링 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
            {/* 모달 컨테이너 */}
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
              
              {/* 모달 헤더 */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">책 검색</h2>
                {/* 닫기 버튼 (X) */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* 검색 입력 섹션 */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex gap-3">
                  {/* 검색어 입력 필드 */}
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Enter 키로 검색
                    placeholder="책 제목을 입력하세요..."
                    className="flex-1 bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  {/* 검색 버튼 */}
                  <BasicButton onClick={handleSearch}>검색</BasicButton>
                </div>
              </div>

              {/* 검색 결과 섹션 */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* 검색 결과가 없을 때 */}
                {books.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    책을 검색해보세요
                  </div>
                ) : (
                  // 검색 결과가 있을 때: 책 목록 표시
                  <div className="space-y-3">
                    {books.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleSelectBook(book)} // 책 클릭 시 선택
                        className="p-4 rounded-xl bg-[#0d0d0d] hover:bg-[#1a1a1a] cursor-pointer transition-colors border border-gray-800 hover:border-gray-700"
                      >
                        <div className="flex gap-4">
                          {/* 책 썸네일 이미지 */}
                          {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                              src={book.volumeInfo.imageLinks.thumbnail}
                              alt={book.volumeInfo.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          {/* 책 정보 */}
                          <div className="flex-1">
                            {/* 책 제목 */}
                            <div className="text-white font-medium mb-1 line-clamp-2">
                              {book.volumeInfo.title}
                            </div>
                            {/* 저자 */}
                            <div className="text-sm text-gray-400">
                              {book.volumeInfo.authors?.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistBookAddPage;