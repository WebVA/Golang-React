/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _trendingCompetitions } from "../../../app/competition/competitionSlice";
import SingleCompetition from "./SingleCompetition";
import { Link } from "react-router-dom";

function TrendingCompetitions({ limit = null }) {
  const trendingCompetitions = useSelector(_trendingCompetitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);

  useEffect(() => {
    if (limit) {
      const temp = trendingCompetitions.slice(0, limit);
      setFilteredCompetitions(temp);
    } else {
      setFilteredCompetitions(trendingCompetitions);
    }
  }, [trendingCompetitions, limit]);

  return (
    <>
      {trendingCompetitions?.length ? (
        <section className="container pt-5 mt-5 mt-md-0 pt-md-6 pt-lg-7">
          <h2 className="text-center mb-5">Trending competitions</h2>
          <div className="row pb-1 justify-content-center ">
            {filteredCompetitions?.map((c) => {
              return c.ID ? (
                <div
                  key={"trending-comp" + c.ID}
                  className="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter"
                >
                  <SingleCompetition key={"c-trending" + c.ID} comp={c} />
                </div>
              ) : (
                <></>
              );
            })}
          </div>
          <div className="text-center">
            <Link
              className="btn btn-outline-primary"
              to="/running-competitions"
            >
              More competitions
            </Link>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
}

export default TrendingCompetitions;
