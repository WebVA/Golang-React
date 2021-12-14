import React from "react";
import { useSelector } from "react-redux";
import {
  _categories,
} from "../../../app/competition/categorySlice";
import SingleCategory from "./SingleCategory";
import { _loading } from "../../../app/appState/appSlice";
import Loading from "../layout/Loading";

function RunningCompetitions({ limit = null }) {
  const categories = useSelector(_categories);
  const loading = useSelector(_loading);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="container pt-5 mt-5 mt-md-0 pt-md-6 pt-lg-7">
        <h2 className="text-center mb-5">All categories</h2>
        <div className="row pb-1">
          {categories &&
            categories.length > 0 &&
            categories.map((c) => {
              return c.ID ? (
                <SingleCategory
                  key={"c-all" + c.ID}
                  title={c.name}
                  url={`/category/${String(c.ID)}`}
                  image={c.image}
                />
              ) : (
                <></>
              );
            })}
        </div>
      </section>
    </>
  );
}

export default RunningCompetitions;
