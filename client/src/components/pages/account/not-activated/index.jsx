import React from "react";
import SideBar from "../SideBar";
import BackgroundSvg from "../BackgroundSvg";
import AccountNotActivated from "./AccountNotActivated";

export default function NotificationSettings() {
  return (
    <>
      <BackgroundSvg />
      {/* <!-- Page content--> */}
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div className="row">
          {/* <!-- Sidebar--> */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <SideBar />
          </div>
          {/* <!-- Content--> */}
          <div className="col-lg-8">
            <AccountNotActivated />
          </div>
        </div>
      </div>
    </>
  );
}
