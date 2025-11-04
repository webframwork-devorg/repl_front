import { useState } from "react";

function FileInput({ label, onFileChange, onUrlChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [mode, setMode] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setMode("file");
    setImageUrl("");
    onFileChange && onFileChange(file);
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setImageUrl(value);
    setMode("url");
    setSelectedFile(null);
    onUrlChange && onUrlChange(value);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageUrl("");
    setMode(null);
  };

  return (
    <div className="flex flex-col gap-2 text-white">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="flex flex-col gap-3 bg-black border border-white rounded-xl p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">이미지 업로드</span>
          <input
            type="file"
            accept="image/*"
            disabled={mode === "url"}
            onChange={handleFileUpload}
            className={`w-full p-2 rounded-md border border-white text-sm cursor-pointer ${
              mode === "url" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">이미지 URL</span>
          <input
            type="text"
            placeholder="https://example.com/image.png"
            value={imageUrl}
            disabled={mode === "file"}
            onChange={handleUrlChange}
            className={`w-full p-2 rounded-md border border-white bg-black text-sm ${
              mode === "file" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {(selectedFile || imageUrl) && (
          <div className="flex flex-col items-center mt-3">
            <p className="text-xs text-gray-400 mb-2">미리보기</p>
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl}
              alt="미리보기"
              className="max-h-48 rounded-md object-cover border border-gray-600"
            />
          </div>
        )}

        {(selectedFile || imageUrl) && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 text-xs text-gray-400 underline hover:text-pink-400 self-end"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}

export default FileInput;
