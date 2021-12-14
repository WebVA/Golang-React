import React, { useState, useEffect } from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import EditCompetitionForm from "./EditCompetitionForm";
import { useParams } from "react-router-dom";
import { _competitions } from "../../../app/competition/competitionSlice";
import { useSelector, useDispatch } from "react-redux";

export default function AdminUploadCompetition() {
  const { ID } = useParams();
  const competitions = useSelector(_competitions);
  const [compToEdit, setCompToEdit] = useState({});

  useEffect(() => {
    if (competitions) {
      const comp = competitions.find((c) => Number(c.ID) === Number(ID));
      setCompToEdit({ ...comp });
    }
  }, [competitions, ID]);
  return (
    <>
      <StandardBackground />
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div className="row">
          <SideBar />
          <EditCompetitionForm compToEdit={compToEdit} />
        </div>
      </div>
    </>
  );
}
