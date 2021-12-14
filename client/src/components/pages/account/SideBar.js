import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { _profile, logoutUser } from "../../../app/user/userSlice";
import { useHistory } from "react-router-dom";

export default function SideBar() {
  const path = window.location.pathname;
  const profile = useSelector(_profile);
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutUserFunc = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    history.push("/");
  };

  return (
    <>
      <div className="bg-light rounded-lg box-shadow-lg">
        <div className="px-4 py-4 mb-1 text-center">
          <h6 className="mb-0 pt-1">
            {profile?.first_name + " " + profile?.last_name}
          </h6>
          <span className="text-muted font-size-sm">@{profile?.username}</span>
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
            Dashboard
          </h3>
          <Link
            className={`d-flex align-items-center nav-link-style px-4 py-3  ${path === "/account/orders" ? "active" : ""
              }`}
            to="/account/orders"
          >
            <i className="fe-shopping-bag font-size-lg opacity-60 mr-2"></i>
            Orders
            <span className="text-muted font-size-sm font-weight-normal ml-auto">
              {/* 2 */}
            </span>
          </Link>

          <Link className={`d-flex align-items-center nav-link-style px-4 py-3 border-top border-bottom ${path === "/account/rewards" ? "active" : ""}`}
            to="/account/rewards">
            <i className="fe-award font-size-lg opacity-60 mr-2"></i>Rewards</Link>
          <Link
            className={`d-flex align-items-center nav-link-style px-4 py-3  ${path === "/account/messages" ? "active" : ""
              }`}
            to="/account/messages"
          >
            <i className="fe-message-square font-size-lg opacity-60 mr-2"></i>
            Messages
            <span className="text-muted font-size-sm font-weight-normal ml-auto">
              {/* 1 */}
            </span>
          </Link>
          <h3 className="d-block bg-secondary font-size-sm font-weight-semibold text-muted mb-0 px-4 py-3">
            Account settings
          </h3>
          <Link
            className={`d-flex align-items-center nav-link-style px-4 py-3  ${path === "/account/profile-info" ? "active" : ""
              }`}
            to="/account/profile-info"
          >
            Profile info
          </Link>

          <div
            className={`d-flex align-items-center border-top hand-hover ${path === "/account/notification-settings" ? "active" : ""
              } `}
          >
            <div className="d-block w-100 nav-link-style px-4 py-3">
              <Link
                to="/account/notification-settings"
                style={{
                  color: `${path === "/account/notification-settings"
                    ? "#766df4"
                    : "#5a5b75"
                    }`,
                }}
              >
                Notifications
              </Link>
            </div>
            {/* <div className="ml-auto px-3  ">
              <div className="custom-control custom-switch">
                <input
                  className="custom-control-input"
                  type="checkbox"
                  // id="notifications-switch"
                  // data-master-checkbox-for="#notification-settings"
                  checked={profile?.notification_settings?.new_competitions}
                />
                <label
                  className="custom-control-label"
                  // htmlFor="notifications-switch"
                ></label>
              </div>
            </div> */}
          </div>
          <div
            className="d-flex align-items-center nav-link-style px-4 py-3 border-top hand-hover"
            onClick={logoutUserFunc}
          >
            <i className="fe-log-out font-size-lg opacity-60 mr-2"></i>Sign out
          </div>
        </div>
      </div>
    </>
  );
}
