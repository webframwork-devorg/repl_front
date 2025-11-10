import { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

function FileInput({ onChange, label = "썸네일 선택" }) {
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState(null);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const objectURL = URL.createObjectURL(selected);
      setPreview(objectURL);
      setMode("file");
      setUrl("");
      onChange({ type: "file", file: selected, preview: objectURL });
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    if (value) {
      setPreview(value);
      setMode("url");
      onChange({ type: "url", url: value, preview: value });
    } else {
      reset();
    }
  };

  const reset = () => {
    setPreview(null);
    setUrl("");
    setMode(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 text-white text-[18px] font-bold">
        <span>{label}</span>
      </div>

      <div
        className={`relative border border-gray-700 rounded-2xl p-6 bg-[#111111] text-gray-200 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-gray-500 ${
          mode === "url" ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          className="hidden"
          disabled={mode === "url"}
        />

        {!preview && (
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center cursor-pointer select-none group"
          >
            <FiUploadCloud className="text-gray-400 text-4xl mb-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm text-gray-400">
              파일을 선택하거나 드래그하세요
            </span>
          </label>
        )}

        {preview && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <button
              type="button"
              onClick={reset}
              className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-gray-300 hover:text-white transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="px-3 text-gray-500 text-sm">또는</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="이미지 URL 입력"
          value={url}
          onChange={handleUrlChange}
          disabled={mode === "file"}
          className={`w-full bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
            mode === "file" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        {url && (
          <button
            type="button"
            onClick={reset}
            className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default FileInput;
