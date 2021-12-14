/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _competitions } from "../../../app/competition/competitionSlice";
import { findNewCompetitionsWithWinners } from "../../../app/helpers/competitions-algorithms";
import { useLocation } from "react-router-dom";
import SinglePreviousWinnerCard from "./SinglePreviousWinnerCard";

export default function PreviousWinners({
  numberOfItems,
  hideTop = false,
  hideLoadMore = false,
}) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [limit, setLimit] = useState(numberOfItems);
  const location = useLocation();

  useEffect(() => {
    if (filteredCompetitions) {
      const arr = findNewCompetitionsWithWinners(competitions);
      setFilteredCompetitions(arr.slice(0, limit));
    }
  }, [competitions]);

  return (
    <>
      {hideTop ? (
        <h2 className="pb-4 mb-4 text-center">Previous winners</h2>
      ) : (
        <section class="position-relative bg-gradient pt-6 pb-5 pb-md-6 bg-size-cover bg-fixed">
          <div class="h2 text-light text-center">Previous Winners</div>
        </section>
      )}

      {/* <!-- Portfolio grid--> */}
      <section
        className={`container overflow-hidden py-5 py-md-6 py-lg-5 ${
          location.pathname.match(/\/previous-winners/) ? "full-height" : ""
        }`}
      >
  
        <div className="cs-masonry-filterable">
          <div className="cs-masonry-grid" data-columns="4">
            {filteredCompetitions?.map((comp, i) => {
              if (i >= limit) {
                return <></>;
              }
              return (
               <SinglePreviousWinnerCard comp={comp} key={"previous-winner" + i} />
               );
            })}
          </div>
        </div>

        {!hideLoadMore && filteredCompetitions?.length > limit && (
          <div className="text-center py-3 pb-md-0">
            <div
              className="btn btn-primary"
              onClick={() => {
                setLimit(limit * 2);
              }}
            >
              <i className="fe-refresh-ccw mr-2"></i>Load More
            </div>
          </div>
        )}
      </section>
    </>
  );
}
