import { useState } from "react";
import { FiX, FiImage } from "react-icons/fi";

function FileInput() {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState(null); 
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setMode("file");
      setUrl("");
      setPreview(URL.createObjectURL(file)); 
    } else {
      resetFile();
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    if (value !== "") {
      setMode("url");
      setFileName("선택된 파일 없음");
      setPreview(value);
    } else {
      resetUrl();
    }
  };

  const resetFile = () => {
    setFileName("선택된 파일 없음");
    setMode(null);
    setPreview(null);
  };

  const resetUrl = () => {
    setUrl("");
    setMode(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <div
        className={`relative flex border ${
          mode === "url" ? "opacity-50 cursor-not-allowed" : "border-gray-300"
        } rounded-xl overflow-hidden w-full bg-white`}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
          disabled={mode === "url"}
        />
        <label
          htmlFor="fileInput"
          className={`cursor-pointer px-4 py-2 font-semibold border-r border-gray-300 ${
            mode === "url"
              ? "pointer-events-none bg-gray-100 text-gray-400"
              : "hover:bg-gray-100 transition text-black"
          }`}
        >
          파일 선택
        </label>
        <span className="px-4 py-2 text-gray-500 truncate flex-1">
          {fileName}
        </span>

        {mode === "file" && (
          <button
            onClick={resetFile}
            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center w-full">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-3 text-gray-400 text-sm">또는</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="이미지 URL을 입력하세요"
          value={url}
          onChange={handleUrlChange}
          disabled={mode === "file"}
          className={`w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 ${
            mode === "file"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : ""
          }`}
        />
        {mode === "url" && (
          <button
            onClick={resetUrl}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <div className="w-full border border-gray-300 rounded-xl p-4 flex items-center justify-center bg-gray-50 h-48">
        {preview ? (
          <img
            src={preview}
            alt="미리보기"
            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center gap-2">
            <FiImage size={24} />
            <p className="text-sm">이미지 미리보기</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileInput;
