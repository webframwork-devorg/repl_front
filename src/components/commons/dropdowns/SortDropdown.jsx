import React, { useEffect, useRef, useState } from "react";
import DownButton from "@/assets/images/down-button.svg";

function SortDropdown({ options = [], initialValue, onChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(
    initialValue
      ? options.find((opt) => opt.value === initialValue) || options[0]
      : options[0]
  );
  const ref = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleSelect = (option) => {
    setSelected(option);
    setIsDropdownOpen(false);
    onChange?.(option.value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="flex justify-end relative w-[80px] select-none">
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="font-bold text-[15px] text-[#828282]">
          {selected?.label || ""}
        </span>
        <img
          className={`w-[10px] h-[10px] transition-transform duration-150 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          src={DownButton}
          alt="드롭다운 버튼"
        />
      </div>

      {isDropdownOpen && (
        <ul
          className="absolute right-0 top-full mt-2 border border-[#2C2C2C]
                     bg-[#1F1F1F] rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 font-bold text-[14px] transition cursor-pointer
                ${
                  selected?.value === option.value
                    ? "bg-[#2C2C2C] text-white"
                    : "text-[#828282] hover:bg-[#2C2C2C] hover:text-white"
                }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SortDropdown;
