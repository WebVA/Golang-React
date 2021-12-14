import React from "react";
import { useSelector } from "react-redux";
import { _profile } from "../../app/user/userSlice";
import { Link } from "react-router-dom";

export default function SideBar() {
  const profile = useSelector(_profile);
  const path = window.location.pathname;
  return (
    <>
      <div className="col-lg-4 mb-4 mb-lg-0">
        <div className="bg-light rounded-lg box-shadow-lg">
          <div className="px-4 py-4 mb-1 text-center">
            <h6 className="mb-0 pt-1">
              {profile.first_name + " " + profile.last_name}
            </h6>
            <span className="text-muted font-size-sm">@{profile.username}</span>
          </div>
          <div className="d-lg-none px-4 pb-4 text-center">
            <a
              className="btn btn-primary px-5 mb-2"
              href="#account-menu"
              data-toggle="collapse"
            >
              <i className="fe-menu mr-2"></i>Account menu
            </a>
          </div>
          <div className="d-lg-block collapse pb-2" id="account-menu">
            <h3 className="d-block bg-secondary font-size-sm font-weight-semibold text-muted mb-0 px-4 py-3">
              Admin Dashboard
            </h3>
            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover  ${path === "/admin/upload-competition" ? " active" : ""
                }`}
              to="/admin/upload-competition"
            >
              <i className="fe-upload font-size-lg opacity-60 mr-2"></i>Upload
              New Competition
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover  ${path === "/admin/upload-category" ? " active" : ""
                }`}
              to="/admin/upload-category"
            >
              <i className="fe-upload font-size-lg opacity-60 mr-2"></i>Upload
              New Category
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/send-message-to-all-users" ? "active" : ""
                }`}
              to="/admin/send-message-to-all-users"
            >
              <i className="fas fa-envelope font-size-lg opacity-60 mr-2"></i>Send
              Message To All Users
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/all-competitions" ? "active" : ""
                }`}
              to="/admin/all-competitions"
            >
              <i className="fas fa-edit font-size-lg opacity-60 mr-2"></i>
              All Competitions
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/all-categories" ? "active" : ""
                }`}
              to="/admin/all-categories"
            >
              <i className="fas fa-edit font-size-lg opacity-60 mr-2"></i>
              All Categories
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/app-options" ? "active" : ""
                }`}
              to="/admin/app-options"
            >
              <i className="fas fa-edit font-size-lg opacity-60 mr-2"></i>
              App Options
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/assign-winner" ? "active" : ""
                }`}
              to="/admin/assign-winner"
            >
              <i className="fas fa-edit font-size-lg opacity-60 mr-2"></i>
              Assign winner
            </Link>

            <Link
              className={`d-flex align-items-center nav-link-style px-4 py-3 hand-hover ${path === "/admin/prizes" ? "active" : ""
                }`}
              to="/admin/prizes"
            >
              <i className="fas fa-edit font-size-lg opacity-60 mr-2"></i>
              Manage Rewards
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
