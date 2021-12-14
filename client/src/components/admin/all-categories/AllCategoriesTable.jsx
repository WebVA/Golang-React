import React, {  } from "react";
import { useSelector } from "react-redux";
import { _categories } from "../../../app/competition/categorySlice";
import { _competitions } from "../../../app/competition/competitionSlice";
import { _loading } from "../../../app/appState/appSlice";
import Loading from "../../pages/layout/Loading.js";
import { Link } from "react-router-dom";
import {
  findAllCompetitionsWithSameCategory,
  findRunningCompetitionsWithSameCategory,
} from "../../../app/helpers/competitions-algorithms.js";

function AllCategoriesTable({ limit = null }) {
  const categories = useSelector(_categories);
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
                <th>all competitions</th>
                <th>running</th>
                <th>actions</th>
              </tr>
            </thead>
            {categories?.map((cat) => {
              const all = findAllCompetitionsWithSameCategory(
                competitions,
                cat.ID
              );
              const running = findRunningCompetitionsWithSameCategory(
                competitions,
                cat.ID
              );

              return (
                <tr key={"cat-tr-" + cat.ID}>
                  <td>{cat.ID}</td>
                  <td><Link to={`/category/${cat.ID}`}>{cat.name}</Link></td>
                  <td>{all?.length || null}</td>
                  <td>
                   {running?.length || null}
                  </td>
                  <td>
                    <Link to={`/admin/edit-category/${cat.ID}`}>
                      <button className="btn btn-primary">Edit </button>
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

export default AllCategoriesTable;
