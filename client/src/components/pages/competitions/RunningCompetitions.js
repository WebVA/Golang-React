/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _competitions } from "../../../app/competition/competitionSlice";
import SingleCompetition from "./SingleCompetition";
import Loading from "../layout/Loading";
import { findNewCompetitions } from "../../../app/helpers/competitions-algorithms";
import BreadCrumbs from "../../shared/BreadCrumbs";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";
import Empty from "../layout/Empty";

function RunningCompetitions({ limit = null }) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const wait = useWaitCompsAndCats();

  useEffect(() => {
    const arr = findNewCompetitions(competitions);
    if (limit) {
      const temp = arr.slice(0, limit + 1);
      setFilteredCompetitions(temp);
      return;
    }
    setFilteredCompetitions(arr);
  }, [competitions]);

  return (
    <>
      <section className="container pt-3 h-100 full-height">
        <BreadCrumbs
          crumbs={[
            { to: "/running-competitions", title: "Running Competitions" },
          ]}
        />
        {wait ? (
          <Loading />
        ) : (
          <div className="row pb-1">
            {filteredCompetitions?.length ? (
              filteredCompetitions?.map((c) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
                  <SingleCompetition key={"c-all" + c.ID} comp={c} />
                </div>
              ))
            ) : (
              <Empty message="Sorry, There are no running competitions at the moment" />
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default RunningCompetitions;
