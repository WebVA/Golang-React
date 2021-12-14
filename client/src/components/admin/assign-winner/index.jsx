import React, { } from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import AllFinishedCompetitionsWithNoWinnerTable from "./AllFinishedCompetitionsWithNoWinnerTable";
import { Route } from "react-router-dom";
import AssignWinnerForm from "./AssignWinnerForm";

export default function AllCompetitions() {
 
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div class="row">
          <SideBar />
          <Route path="/admin/assign-winner" exact>
            <AllFinishedCompetitionsWithNoWinnerTable />
          </Route>

          <Route path="/admin/assign-winner/:compID">
            <AssignWinnerForm  />
          </Route>
        </div>
      </div>
    </>
  );
}
