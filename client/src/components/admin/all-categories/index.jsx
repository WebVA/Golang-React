import React from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import AllCategoriesTable from "./AllCategoriesTable";

export default function AllCategories() {
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div class="row">
          <SideBar />
          <AllCategoriesTable />
        </div>
      </div>
    </>
  );
}
