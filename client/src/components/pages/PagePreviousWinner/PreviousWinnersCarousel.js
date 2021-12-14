import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _competitions } from "../../../app/competition/competitionSlice";
import { _loading } from "../../../app/appState/appSlice";
import Loading from "../layout/Loading";
import SinglePreviousWinnerCard from "../previous-winners/SinglePreviousWinnerCard";
import { findMorePreviousWinnersSuggestions } from "../../../app/helpers/competitions-algorithms";

export default function PreviousWinnersCarousel({
  numberOfItems,
  competitionID,
}) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const loading = useSelector(_loading);
  const [limit, setLimit] = useState(numberOfItems);

  useEffect(() => {
    const arr = findMorePreviousWinnersSuggestions(competitions);
    setFilteredCompetitions(arr.slice(0, limit));
  }, [competitions, limit, competitionID]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <section className="border-top py-5 py-lg-6">
        <div className="container py-3 py-md-0">
          <h2 className="h3 text-center mb-5">More Previous Winners</h2>
          <div className="cs-carousel">
            <div className="cs-carousel-inner row">
              {filteredCompetitions?.map((comp, i) => {
                if (i >= limit) {
                  return <></>;
                }
                return (
                  <div className="col-lg-3" key={"previous-winner" + i}>
                    <SinglePreviousWinnerCard comp={comp} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
