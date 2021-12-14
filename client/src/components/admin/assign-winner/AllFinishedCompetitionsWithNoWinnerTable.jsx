import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  _competitions,
} from "../../../app/competition/competitionSlice";
import { _loading } from "../../../app/appState/appSlice";
import Loading from "../../pages/layout/Loading.js";
import { Link } from "react-router-dom";
import {
  findAllFinishedCompetitionsWithNoWinner,
} from "../../../app/helpers/competitions-algorithms.js";

function AllFinishedCompetitionsWithNoWinnerTable({ limit = null }) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const loading = useSelector(_loading);

  useEffect(() =>{
      const res = findAllFinishedCompetitionsWithNoWinner(competitions);
      setFilteredCompetitions(res);
  }, [competitions])

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
                <th>actions</th>
              </tr>
            </thead>
            {filteredCompetitions?.map((c) => {
              return (
                <tr key={"comp-tr-" + c.ID}>
                  <td>{c.ID}</td>
                  <td>{c.title}</td>
                  <td>{c.end_time}</td>
                  <td>
                    <Link to={`/admin/assign-winner/${c.ID}`}>
                      <button className="btn btn-primary">Assign Winner </button>
                    </Link>
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

export default AllFinishedCompetitionsWithNoWinnerTable;
