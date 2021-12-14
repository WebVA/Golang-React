/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { _competitions } from "../../../app/competition/competitionSlice";
import { _categories } from "../../../app/competition/categorySlice";

import { findRunningCompetitionsWithSameCategory } from "../../../app/helpers/competitions-algorithms";

import useAllFetched from "../../hooks/useAllFetched.jsx";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";

import Loading from "../layout/Loading";
import Empty from "../layout/Empty";

import BreadCrumbs from "../../shared/BreadCrumbs";
import SingleCompetition from "../competitions/SingleCompetition";

function CategoryPage({ limit = null }) {
  const { catID } = useParams();
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const categories = useSelector(_categories);
  const [catName, setCatName] = useState("");
  const wait = useWaitCompsAndCats();
  const allFetched = useAllFetched();

  useEffect(() => {
    if (categories) {
      const c = categories.find((ca) => Number(ca.ID) === Number(catID));
      setCatName(c?.name);
    }
  }, [categories, catID]);

  useEffect(() => {
    const arr = findRunningCompetitionsWithSameCategory(competitions, catID);
    if (limit) {
      const temp = arr.slice(0, limit + 1);
      setFilteredCompetitions(temp);
      return;
    }
    setFilteredCompetitions(arr);
  }, [competitions, catID]);

  if (allFetched && !wait && !catName) {
    return <Empty message={`sorry there is no such a category`} />;
  }

  return (
    <>
      {wait ? (
        <Loading />
      ) : (
        <section className="container mt-md-0 pt-3">
          <BreadCrumbs
            crumbs={[
              { to: "/categories", title: "Categories" },
              { to: "#", title: catName },
            ]}
          />

          {/* <pre>{catID + ' ' +  categoriesFetched + ' ' + competitionsFetched} {JSON.stringify(filteredCompetitions, null, 4)}</pre> */}
          <h2 className="text-center mb-5">{catName}</h2>
          {filteredCompetitions?.length ? (
            <>
              <div className="row pb-1">
                {filteredCompetitions?.map((c) => {
                  return <SingleCompetition comp={c} />;
                })}
              </div>
            </>
          ) : (
            <Empty
              redMessage=""
              message={`Sorry there is no current competitions with this category`}
              extraMessage=""
              linkText="check another category"
              link="/categories"
            />
          )}
        </section>
      )}
    </>
  );
}

export default CategoryPage;
