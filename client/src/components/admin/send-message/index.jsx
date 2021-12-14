import React from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import MessageForm from "./MessageForm";

export default function SendMessageToAllUsers() {
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div class="row">
          <SideBar />
          <MessageForm />
        </div>
      </div>
    </>
  );
}
