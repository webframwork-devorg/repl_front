import { useState } from "react";
import { FiX } from "react-icons/fi";

function Area({ label = "내용 입력", maxLength, onChange }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.slice(0, maxLength);
    setText(value);
    onChange(value);
  };

  const reset = () => {
    setText("");
    onChange("");
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 font-bold text-[18px] text-white">
        <span>{label}</span>
      </div>

      <div className="relative group">
        <textarea
          placeholder="생각이나 내용을 자유롭게 작성하세요..."
          value={text}
          onChange={handleChange}
          rows={6}
          className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
        />

        {text && (
          <button
            type="button"
            onClick={reset}
            className="absolute right-3 top-3 text-gray-500 hover:text-red-500 transition"
          >
            <FiX size={22} />
          </button>
        )}

        <div className="absolute bottom-2 right-3 text-xs text-gray-500 select-none">
          {text.length} / {maxLength}
        </div>

        <div className="absolute inset-0 rounded-2xl ring-0 group-focus-within:ring-2 ring-white/10 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}

export default Area;
