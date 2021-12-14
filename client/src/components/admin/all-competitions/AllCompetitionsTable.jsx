import React from "react";
import { useSelector } from "react-redux";
import { _competitions } from "../../../app/competition/competitionSlice";
import { _loading } from "../../../app/appState/appSlice";
import Loading from "../../pages/layout/Loading.js";
import { isDatePassed } from "../../../app/helpers/utils.js";
import { Link } from "react-router-dom";

function AllCompetitions() {
  const competitions = useSelector(_competitions);
  const loading = useSelector(_loading);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="col-lg-8 full-height w-100">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <table className="table" style={{ fontSize: "12px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>title</th>
                <th>finished</th>
                <th>winner</th>
                <th>actions</th>
              </tr>
            </thead>
            {competitions?.map((c) => {
              return (
                <tr key={"comp-tr-" + c.ID}>
                  <td>{c.ID}</td>
                  <td>  <Link to={`/competition/${c.ID}`}>{c.title}</Link></td>
                  <td>{isDatePassed(c.end_time) ? "Yes" : null}</td>
                  <td>
                    {c.winner?.ID
                      ? "ID: " +
                      c.winner.ID +
                      ` (${c.winner.first_name + " " + c.winner.last_name})`
                      : null}
                  </td>
                  <td>
                    <Link to={`/admin/edit-competition/${c.ID}`}>
                      <button className="btn btn-primary">Edit </button>
                    </Link>
                    <a href={`/admin/view-tickets-real-time/${c.ID}`} className="ml-1">
                      <button className="btn btn-primary">Tickets </button>
                    </a>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
}

export default AllCompetitions;
