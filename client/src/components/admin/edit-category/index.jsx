import React, { useState, useEffect } from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import EditCategoryForm from "./EditCategoryForm";
import { useParams } from "react-router-dom";
import { _categories } from "../../../app/competition/categorySlice";
import { useSelector } from "react-redux";

export default function AdminUploadCompetition() {
  const { ID } = useParams();
  const categories = useSelector(_categories);
  const [catToEdit, setCatToEdit] = useState({});

  useEffect(() => {
    const cat = categories?.find((c) => Number(c.ID) === Number(ID));
    if (cat) {
      setCatToEdit({ ...cat });
    }
  }, [categories, ID]);
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div className="row">
          <SideBar />
          <EditCategoryForm catToEdit={catToEdit} />
        </div>
      </div>
    </>
  );
}
