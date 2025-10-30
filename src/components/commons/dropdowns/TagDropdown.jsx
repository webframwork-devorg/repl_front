import React, { useEffect, useRef, useState } from "react";

function TagDropdown({ tags = [], initialSelected = [], onChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(initialSelected);
  const ref = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(tag);
      let updated;

      if (exists) {
        updated = prev.filter((t) => t !== tag);
      } else if (prev.length < 2) {
        updated = [...prev, tag]; 
      } else {
        updated = prev;
      }

      onChange?.(updated);
      return updated;
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label =
    selectedTags.length > 0
      ? selectedTags.map((t) => `#${t}`).join(" ")
      : "#태그 선택";

  return (
    <div
      ref={ref}
      className="flex justify-start relative w-[110px] select-none"
    >
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="font-bold text-[16px] text-[#828282]">{label}</span>
      </div>

      {isDropdownOpen && (
        <ul
          className="absolute top-full mt-2 border border-[#2C2C2C]
                     bg-[#1F1F1F] rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const isFull = selectedTags.length >= 2 && !isSelected;

            return (
              <li
                key={tag}
                onClick={() => !isFull && handleTagSelect(tag)}
                className={`px-8 py-2 font-bold text-[14px] transition cursor-pointer
                  ${
                    isSelected
                      ? "bg-[#2C2C2C] text-white"
                      : "text-[#828282] hover:bg-[#2C2C2C] hover:text-white"
                  }
                  ${isFull ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {tag}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TagDropdown;
