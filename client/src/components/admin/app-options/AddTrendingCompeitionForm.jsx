import React, { useState, useEffect } from "react";
import {
  _competitions,
  updateCompetition,
} from "../../../app/competition/competitionSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../pages/layout/Loading";
import ErrorMessage from "../../shared/ErrorMessage";
import SuccessMessage from "../../shared/SuccessMessage";
import { isCompetitionFinished } from "../../../app/helpers/competitions-algorithms";

export default function AddTrendingCompetition() {
  const competitions = useSelector(_competitions);
  const [newFeaturedID, setNewFeaturedID] = useState(0);
  const [newFeaturedComp, setNewFeaturedComp] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setError("");
    setNewFeaturedComp(null);
    if (newFeaturedID) {
      const c = competitions?.find(
        (el) => Number(el.ID) === Number(newFeaturedID)
      );
      if (!c?.ID) {
        setSuccess("");
        setError("no competition with this id");
        return;
      }
      setError("");
      setNewFeaturedComp(c);
    }
  }, [newFeaturedID, competitions]);

  const addNewFeaturedCompetition = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setWait(true);

    if (isCompetitionFinished(newFeaturedComp)) {
      setError(
        "this competition is already finished, it won't appear on the trending section. "
      );
      setWait(false);
      return;
    }
    const r = await dispatch(
      updateCompetition(newFeaturedID, { trending: true })
    );
    if (r.error) {
      setError(r.error);
      setWait(false);
      return;
    }

    setSuccess(`done, ${newFeaturedComp?.title} has been added as trending`);
    setWait(false);
  };

  return (
    <>
      {wait ? (
        <Loading />
      ) : (
        <form className="needs-validation p-2">
          <h4>Add Trending Competition</h4>
          {error && <ErrorMessage msg={error} />}
          {success && <SuccessMessage msg={success} />}
          <div className="row mb-4">
            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                New Trending competition ID:
              </label>
              <input
                className="form-control"
                type="text"
                id="priceProductCreate"
                placeholder=""
                name="competition.price"
                value={newFeaturedID}
                onChange={(e) => setNewFeaturedID(Number(e.target.value))}
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                see competition before assigning:
              </label>

              <button
                className="btn btn-success"
                disabled={!newFeaturedComp?.ID}
              >
                <a
                  href={
                    newFeaturedComp?.ID
                      ? `/competition/${newFeaturedComp?.ID}`
                      : ""
                  }
                  target={newFeaturedComp?.ID ? "_blank" : ""}
                  style={{
                    pointerEvents: newFeaturedComp?.ID ? "" : "none",
                    cursor: newFeaturedComp?.ID ? "pointer" : "default",
                  }}
                  rel="noreferrer noopener"
                  className="text-white"
                >
                  open in new page
                </a>
              </button>
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                New Trending competition Title:
              </label>
              <input
                className="form-control"
                type="text"
                placeholder=""
                value={newFeaturedComp?.title || null}
                readOnly
              />
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                save when you done :
              </label>

              <button
                className="btn btn-primary"
                disabled={!newFeaturedComp?.ID}
                onClick={addNewFeaturedCompetition}
              >
                Add New Trending competition
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
