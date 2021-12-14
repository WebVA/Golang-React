import React from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import RewardsForm from "./RewardsForm";
import AppOptionsForm from "./AppOptionsForm";
import EditFeaturedCompetitionsListForm from "./EditFeaturedCompetitionsListForm.jsx";
import AddFeaturedCompetition from "./AddFeaturedCompetitionForm";
import EditTrendingCompetitionsListForm from "./EditTrendingCometitionsListForm";
import AddTrendingCompetition from "./AddTrendingCompeitionForm";

const Separator = () => (
  <>
    <br />
    <hr />
    <br />
  </>
);

export default function AppOptions() {
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div class="row">
          <SideBar />
          <div className="col-lg-8">
            <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
              <div className="py-2 p-md-3">
                <div style={{ display: "block" }}>
                  <div className="d-sm-flex align-items-center justify-content-between pb-2">
                    <h1 className="h3 mb-3 text-center text-sm-left">
                      App Options Form
                    </h1>
                  </div>
                </div>

                {/* content is here */}
                <RewardsForm />
                <Separator />
                <AppOptionsForm />
                <Separator />
                <EditFeaturedCompetitionsListForm />
                <Separator />
                <AddFeaturedCompetition />
                <Separator />
                <EditTrendingCompetitionsListForm />
                <Separator />
                <AddTrendingCompetition />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
