import React, { useState, useEffect, useRef } from "react";

function SelectPlaylist({
  label,
  value,
  onChange,
  options = [],
  placeholder = "선택하세요",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false); 
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      {label && (
        <label className="font-bold text-white text-[18px]">
          {label}
        </label>
      )}

      <div className="relative w-full select-none">
        <div
          onClick={toggleDropdown}
          className={`
            w-full bg-[#1E1E1E] px-5 py-4 rounded-2xl 
            flex justify-between items-center cursor-pointer transition-all
            border border-transparent
            ${isOpen ? "ring-1 ring-white" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2a2a2a]"}
          `}
        >
          <span
            className={`text-[16px] ${
              selectedOption ? "text-white" : "text-[#9CA3AF]"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
                className="w-5 h-5 text-gray-400" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {isOpen && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-[#1E1E1E] rounded-xl border border-[#333] shadow-xl z-50 overflow-hidden max-h-[240px] overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`
                  px-5 py-3 text-[15px] cursor-pointer transition-colors
                  ${
                    selectedOption?.value === option.value
                      ? "bg-[#333] text-white font-bold"
                      : "text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
                  }
                `}
              >
                {option.label}
              </li>
            ))}
            
            {options.length === 0 && (
              <li className="px-5 py-3 text-gray-500 text-sm cursor-default">
                선택할 수 있는 항목이 없습니다.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SelectPlaylist;