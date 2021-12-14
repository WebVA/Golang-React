import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function NavBarLink({
  text,
  to,
  activePattern,
  setShowSidebar,
  showSidebar,
  children = null,
  dropdown = false,
}) {
  const location = useLocation();

  return (
    <>
      <li className={`nav-item ${dropdown ? "dropdown" : ""} `}>
        <Link
          className={`nav-link ${dropdown ? "dropdown-toggle" : ""} ${
            location.pathname.match(activePattern) ? "active" : ""
          } `}
          to={to}
          onClick={() => setShowSidebar(!showSidebar)}
          data-toggle={`${dropdown ? "dropdown" : ""}`}
        >
          {text}
        </Link>

        {children}
      </li>
    </>
  );
}
