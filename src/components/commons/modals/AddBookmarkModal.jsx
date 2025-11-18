import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient"; // Supabase 클라이언트 import

// 1. 북마크 색상 및 ID 
const BOOKMARK_COLORS = [
  { id: 1, hex: "#FFFFFF", name: "White" },
  { id: 4, hex: "#D9D9F9", name: "Blue" },
  { id: 3, hex: "#FFF9D9", name: "Orange" },
  { id: 2, hex: "#F9D9E8", name: "Pink" },
  { id: 5, hex: "#D9F9E3", name: "Green" },
];

/**
 * 책갈피(인용구) 추가 모달
 * @param {object} props
 * @param {function} props.onClose - 모달 닫기 함수
 * @param {string|number} props.playlistItemId - 이 책갈피가 속할 'playlist_item'의 ID
 */
function AddBookmarkModal({ onClose, playlistItemId }) {

  const [selectedBgId, setSelectedBgId] = useState(BOOKMARK_COLORS[0].id); // 기본값으로 첫 번째 색상 ID
  const [pageNumber, setPageNumber] = useState("");
  const [passageText, setPassageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 텍스트 입력 변경 핸들러
  const handleTextChange = (e) => {
    if (e.target.value.length <= 84) {
      setPassageText(e.target.value);
    }
  };

  // Supabase에 저장하는 '완료' 버튼 핸들러
  const handleSubmit = async () => {
    if (!passageText) {
      setError("북마크할 내용을 입력해주세요.");
      return;
    }
    if (!playlistItemId) {
      setError("플레이리스트 아이템 ID가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("favorite_passages").insert([
        {
          item_id: playlistItemId, // BookPage에서 받은 ID
          passage_text: passageText,
          page_number: pageNumber ? parseInt(pageNumber, 10) : null,
          background_id: selectedBgId,
        },
      ]);

      if (error) throw error;

      // 성공 시 모달 닫기
      onClose();
    } catch (error) {
      console.error("북마크 저장 실패:", error.message);
      setError("저장에 실패했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <style>
      {`
        /* Chrome, Safari, Edge */
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Firefox */
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}
      </style>
      <div className="w-full max-w-md p-6 mx-4 bg-[#333333] rounded-lg shadow-lg">
        
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white text-lg transition-opacity hover:opacity-70"
          >
            닫기
          </button>
          <h2 className="text-xl text-white">책갈피 생성</h2>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-[#3478F6] text-lg font-bold transition-opacity hover:opacity-70 disabled:opacity-50"
          >
            {isLoading ? "저장중..." : "완료"}
          </button>
        </div>

        {/* 책갈피 디자인 선택 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            책갈피 디자인 선택
          </h3>
          <div className="flex justify-between">
            {BOOKMARK_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedBgId(color.id)}
                className={`w-14 h-14 rounded-md transition-all ${
                  selectedBgId === color.id
                    ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-800" 
                    : "ring-2 ring-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        {/* 페이지 번호 입력 */}
        <div className="mb-4">
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="북마크할 페이지의 번호를 입력하세요"
            className="no-spinner w-full p-4 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 내용 입력 (Textarea) */}
        <div className="mb-4">
          <textarea
            value={passageText}
            onChange={handleTextChange}
            placeholder="북마크할 내용을 입력하세요"
            className="w-full h-40 p-4 bg-gray-700 text-white rounded-md placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={84} // 글자 수 제한
          />
          <div className="text-right text-gray-400 text-sm mt-1">
            {passageText.length} / 84
          </div>
        </div>

        {/* 에러 메시지 표시 */}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default AddBookmarkModal;