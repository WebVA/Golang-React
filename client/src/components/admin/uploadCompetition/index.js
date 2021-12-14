import React from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import UploadForm from "./UploadForm";


export default function AdminUploadCompetition() {


  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div className="row">
          <SideBar />
          <UploadForm />
        </div>
      </div>
    </>
  );
}
