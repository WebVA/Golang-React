import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import UploadCompetition from "./uploadCompetition";
import { _isAdmin } from "../../app/user/userSlice";
import { useSelector } from "react-redux";
import SendMessageToAllUsers from "./send-message/index.jsx";
import UploadCategory from "./upload-category/index";
import AllCompetitions from "./all-competitions/index.jsx";
import EditCompetition from "./edit-competition/index";
import AllCategories from "./all-categories/index";
import AssignWinner from "./assign-winner/index";
import AppOptions from "./app-options/index";
import Loading from "../pages/layout/Loading";
import EditCategory from "./edit-category/index.jsx";
import useAllFetched from "../hooks/useAllFetched";
import ViewTicketsRealTime from "./vew-tickets/index";
import PrizesManagement from "./prizes/index.jsx"

export default function AdminRouter() {
  const isAdmin = useSelector(_isAdmin);
  const allFetched = useAllFetched();
  const [wait, setWait] = useState(true);

  useEffect(() => {
    if (allFetched)
      setTimeout(() => {
        setWait(false);
      }, 500);
  }, [allFetched]);

  const Blocked = () => (
    <div style={{ height: "50vh" }} className="text-center">
      <h1 className="text-center" style={{ marginTop: "20%" }}>
        401 | You are not Authorized !!
      </h1>
      <br />
      <Link to="/">
        <button className="btn btn-primary">go to home page</button>
      </Link>
    </div>
  );

  return (
    <>
      {!wait ? (
        <>
          {!isAdmin ? (
            <Blocked />
          ) : (
            <Switch>
              <Route path="/admin/app-options" exact>
                <AppOptions />
              </Route>
              <Route path="/admin/upload-category" exact>
                <UploadCategory />
              </Route>
              <Route path="/admin/assign-winner">
                <AssignWinner />
              </Route>
              <Route path="/admin/upload-competition" exact>
                <UploadCompetition />
              </Route>
              <Route path="/admin/edit-competition/:ID">
                <EditCompetition />
              </Route>
              <Route path="/admin/view-tickets-real-time/:compID">
                <ViewTicketsRealTime />
              </Route>
              <Route path="/admin/edit-category/:ID">
                <EditCategory />
              </Route>
              <Route path="/admin/all-competitions" exact>
                <AllCompetitions />
              </Route>
              <Route path="/admin/all-categories" exact>
                <AllCategories />
              </Route>
              <Route path="/admin/send-message-to-all-users" exact>
                <SendMessageToAllUsers />
              </Route>
              <Route path="/admin/prizes" exact>
                <PrizesManagement />
              </Route>
            </Switch>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
