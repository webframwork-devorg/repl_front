import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextArea from "@/components/commons/inputs/TextArea";
import SelectPlaylist from "@/components/commons/dropdowns/SelectPlaylist";
import { getMyPlaylists } from "@/api/playlists/getMyPlaylists";
import { addBookToPlaylist } from "@/api/books/addBookToPlaylist"; // api 탭 supabase 쿼리 따로 분리
import { searchGoogleBooks } from "@/api/books/searchBooks"; // 구글북스 api 
import BasicButton from "@/components/commons/buttons/BasicButton";

function AddBookPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: "",
    playlistId: "",
    readDate: "",
    rating: "",
  });

  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const playlistsData = await getMyPlaylists();
        setPlaylists(playlistsData || []);
      } catch (err) {
        console.error("데이터 불러오기 오류:", err);
        alert("플레이리스트를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const results = await searchGoogleBooks(query);
      setBooks(results);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSelectBook = (book) => {
    setFormData({
      ...formData,
      image: book.volumeInfo.imageLinks?.thumbnail || "",
      title: book.volumeInfo.title || "",
      author: book.volumeInfo.authors?.join(", ") || "",
    });
    setIsModalOpen(false);
    setBooks([]);
    setQuery("");
  };

  const handlePlaylistChange = (value) => {
    setFormData((prev) => ({ ...prev, playlistId: value }));
  };

  const handleContentChange = (value) =>
    setFormData((prev) => ({ ...prev, content: value }));

  const handleSubmit = async () => {
    if (!formData.playlistId || !formData.title) {
      alert("플레이리스트와 책 제목을 입력해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ API 함수 호출로 간결해짐
      const result = await addBookToPlaylist({
        playlistId: parseInt(formData.playlistId),
        title: formData.title,
        author: formData.author,
        image: formData.image,
        content: formData.content,
        readDate: formData.readDate,
        rating: formData.rating,
      });

      if (result.success) {
        alert("책이 플레이리스트에 추가되었습니다!");
        navigate(`/list/${formData.playlistId}`);
      } else {
        alert(`등록 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("저장 오류:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 상단 네비게이션 바 */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-800">
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300 transition-colors text-base sm:text-lg"
          >
            닫기
          </button>
          <span className="text-base sm:text-lg font-medium">책 추가</span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-white hover:text-gray-300 transition-colors text-base sm:text-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? "등록 중..." : "완료"}
          </button>
        </div>

        {/* 플레이리스트 선택 */}
        <div className="mb-8">
          <SelectPlaylist
            label="플레이리스트 선택"
            placeholder="책을 추가할 플레이리스트를 선택하세요"
            value={formData.playlistId}
            onChange={handlePlaylistChange}
            disabled={loading}
            options={playlists.map((p) => ({
              value: p.id,
              label: p.title,
            }))}
          />
        </div>

        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 왼쪽: 책 표지 이미지 */}
          <div className="flex flex-col items-center lg:items-start">
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full aspect-[3/4] max-w-[320px] lg:max-w-full border-2 border-gray-700 rounded-2xl flex items-center justify-center bg-[#0d0d0d] hover:border-white cursor-pointer transition-all duration-300 overflow-hidden"
            >
              {!formData.image ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">클릭하여</p>
                    <p className="text-lg">책을 검색하세요</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full group">
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      다른 책 검색
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 입력 폼 */}
          <div className="flex flex-col gap-6">
            {/* 제목 */}
            <div>
              <label className="block mb-2 text-[18px] font-bold text-white">
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="책 제목을 입력하세요"
                maxLength={100}
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            {/* 작가 */}
            <div>
              <label className="block mb-2 text-[18px] font-bold text-white">
                작가
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="작가명을 입력하세요"
                maxLength={50}
                className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            {/* 코멘트 */}
            <TextArea
              label="한줄평"
              maxLength={500}
              onChange={handleContentChange}
            />

            {/* 읽은 날짜 & 별점 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  읽은 날짜
                </label>
                <input
                  type="date"
                  value={formData.readDate}
                  onChange={(e) =>
                    setFormData({ ...formData, readDate: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  별점 (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  placeholder="0.0"
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 책 검색 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">책 검색</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 border-b border-gray-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="책 제목을 입력하세요..."
                    className="flex-1 bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <BasicButton onClick={handleSearch}>검색</BasicButton>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {books.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    책을 검색해보세요
                  </div>
                ) : (
                  <div className="space-y-3">
                    {books.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className="p-4 rounded-xl bg-[#0d0d0d] hover:bg-[#1a1a1a] cursor-pointer transition-colors border border-gray-800 hover:border-gray-700"
                      >
                        <div className="flex gap-4">
                          {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                              src={book.volumeInfo.imageLinks.thumbnail}
                              alt={book.volumeInfo.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1 line-clamp-2">
                              {book.volumeInfo.title}
                            </div>
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

export default AddBookPage;