import { useState, useRef, useEffect } from "react";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import { AiOutlineBook } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function FloatingMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: <FaPencilAlt />, label: "수정", path: "/edit/list" },
    { icon: <AiOutlineBook />, label: "추가", path: "/book/add" },
  ];

  const showFloatingMenuHandler = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleSubMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  return (
    <div className="fixed bottom-10 right-10" ref={menuRef}>
      <ul
        className={`flex flex-col items-center mb-2.5 transition-all duration-300 ease-in-out ${
          openMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                className="w-[50px] h-[50px] rounded-full bg-[#474749] text-white border border-black flex items-center justify-center cursor-pointer mb-2.5 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-[#5f5c5c]"
                onClick={() => handleSubMenuClick(item.path)}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </li>
          ))}
      </ul>
      <button
        type="button"
        className={`w-[60px] h-[60px] rounded-full bg-[#474749] text-white border-none flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out ${
          openMenu ? "rotate-45" : ""
        }`}
        onClick={showFloatingMenuHandler}
      >
        <FaPlus />
      </button>
    </div>
  );
}

export default FloatingMenu;