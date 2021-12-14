/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  _competitions,
  updateCompetition,
} from "../../../app/competition/competitionSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../pages/layout/Loading";
import { findFeaturedCompetitions } from "../../../app/helpers/competitions-algorithms";
import { Link } from "react-router-dom";
import ErrorMessage from "../../shared/ErrorMessage";
import SuccessMessage from "../../shared/SuccessMessage";

export default function EditFeaturedCompetitionsListForm() {
  const competitions = useSelector(_competitions);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);

  useEffect(() => {
    if (filteredCompetitions) {
      const arr = findFeaturedCompetitions(competitions);
      setFilteredCompetitions(arr);
    }
  }, [competitions]);

  const removeFeaturedCompetition = async (comp) => {
    setError("");
    setSuccess("");
    setWait(true);
    const r = await dispatch(updateCompetition(comp?.ID, { featured: false }));

    if (r.error) {
      setError(r.error);
      setWait(false);
      return;
    }

    setSuccess(`done, ${comp?.title} has been removed`);
    setWait(false);
  };
  return (
    <>
      {wait ? (
        <Loading />
      ) : (
        <>
          <h4>Edit Featured Competitions List</h4>
          {error && <ErrorMessage msg={error} />}
          {success && <SuccessMessage msg={success} />}

          {filteredCompetitions.length && (
            <>
              <table className="table" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>title</th>
                    <th>end time</th>
                    <th>actions</th>
                  </tr>
                </thead>
                {filteredCompetitions?.map((c) => {
                  return (
                    <tr key={"comp-tr-" + c.ID}>
                      <td>{c.ID}</td>
                      <td>
                        <Link to={`/competition/${c.ID}`}>{c.title}</Link>
                      </td>
                      <td>{c.end_time}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFeaturedCompetition(c);
                          }}
                        >
                          Remove{" "}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </>
          )}
        </>
      )}
    </>
  );
}
