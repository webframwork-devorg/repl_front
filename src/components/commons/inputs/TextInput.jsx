import { useState } from "react";
import { FiX } from "react-icons/fi";

function TextInput({ label = "제목", placeholder,maxLength = 50, onChange }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.slice(0, maxLength);
    setText(value);
    onChange(value);
  };

  const handleReset = () => {
    setText("");
    onChange("");
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 text-[18px] font-bold  text-white">
        <span>{label}</span>
      </div>

      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          className="w-full bg-[#0d0d0d] border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
        />

        {text && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-3 top-3 text-gray-500 hover:text-red-500 transition"
          >
            <FiX size={22} />
          </button>
        )}
        <div className="absolute inset-0 rounded-2xl ring-0 group-focus-within:ring-2 ring-white/10 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}

export default TextInput;
