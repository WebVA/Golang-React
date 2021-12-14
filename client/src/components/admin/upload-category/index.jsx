import React from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import UploadCategoryForm from "./UploadCategoryForm";

export default function AdminUploadCategory() {
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div class="row">
          <SideBar />
          <UploadCategoryForm />
        </div>
      </div>
    </>
  );
}
