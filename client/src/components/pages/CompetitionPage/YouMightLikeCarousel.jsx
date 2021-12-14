/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { _competitions } from "../../../app/competition/competitionSlice";
import { findYouMightLikCompetitions } from "../../../app/helpers/competitions-algorithms";
import SingleCompetition from "../competitions/SingleCompetition";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";
import Loading from "../layout/Loading";

export default function YouMightLikeCarousel({ categoryID, compID }) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const wait = useWaitCompsAndCats();
  const isDesktop = useMediaQuery({
    minWidth: 800,
  });

  useEffect(() => {
    if (filteredCompetitions) {
      const arr = findYouMightLikCompetitions(competitions, categoryID);
      setFilteredCompetitions(arr);
    }
  }, [competitions, categoryID, compID]);

  return (
    <>
      <section
        className="container bg-overlay-content"
        // style={{ marginTop: "-290px" }}
        style={{}}
      >
        {wait ? (
          <>
          <Loading />
          </>
        ) : (
          <div
            className="cs-carousel"
            //   id="categories-box-homepage"
            style={{ width: isDesktop ? "100%" : "90%" }}
          >
            {filteredCompetitions.length && (
              <div className="row pb-1">
                {filteredCompetitions?.map((c, i) => {
                  return (
                    <div
                      className="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter"
                      key={"single-comp-sug-" + i}
                    >
                      <SingleCompetition comp={c} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
