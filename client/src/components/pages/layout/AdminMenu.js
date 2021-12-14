import React from "react";
import { Link } from "react-router-dom";
import { _isAdmin } from "../../../app/user/userSlice";
import { useSelector } from "react-redux";

export default function AdminMenu() {
  const isAdmin = useSelector(_isAdmin);

  if (!isAdmin) {
    return <></>;
  }

  return (
    <>
      <li className="nav-item dropdown">
        {/* // eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link className="nav-link dropdown-toggle" to="/admin/upload-competition" data-toggle="dropdown">
          Admin
        </Link>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/admin/upload-competition">
              Dashboard
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
}
