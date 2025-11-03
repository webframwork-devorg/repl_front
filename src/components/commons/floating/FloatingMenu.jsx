import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./FloatingMenu.css";

/**
 * @param {Array} menuItems = [{ icon: <FaPencilAlt />, label: "수정", path: "/edit" }]
 */
function FloatingMenu({ menuItems = [] }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
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
    <div className="floating-menu" ref={menuRef}>
      {openMenu && (
        <ul className="menu-btns">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button type="button" className="sub-menu" onClick={() => handleSubMenuClick(item.path)} aria-label={item.label}>
                {item.icon}
              </button>
            </li>
          ))}
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