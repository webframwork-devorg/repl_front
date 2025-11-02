import { useState, useRef, useEffect } from "react";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import "./FloatingMenu.css";

function FloatingMenu({ onClick, className = "" }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  
  const showFloatingMenuHandler = () => {
    setOpenMenu((prev) => !prev);
    if (onClick) {
      onClick();
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
    <div className="floating-menu" ref={menuRef}>
      {openMenu && (
        <ul className="menu-btns">
          <li>
            <button type="button" className="sub-menu" aria-label="수정">
              <FaPencilAlt />
            </button>
          </li>
          <li>
            <button type="button" className="sub-menu" aria-label="삭제">
              <FaTrash />
            </button>
          </li>
        </ul>
      )}
      <button
        type="button"
        className={`menu-btn ${openMenu ? "open" : ""}`}
        onClick={showFloatingMenuHandler}
      >
        <FaPlus />
      </button>
    </div>
    );
}

export default FloatingMenu;