import React, { useState, useEffect } from "react";
import { _competitions } from "../../../app/competition/competitionSlice";
import { _appOptions, updateAppOption, addAppOption } from "../../../app/appState/appSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../pages/layout/Loading";

export default function AssignWinnerForm() {
  const competitions = useSelector(_competitions);
  const [featuredID, setFeaturedID] = useState(0);
  const [featuredComp, setFeaturedComp] = useState(null);
  const appOptions = useSelector(_appOptions);
  const [newFeaturedID, setNewFeaturedID] = useState(0);
  const [newFeaturedComp, setNewFeaturedComp] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const c = competitions?.find((el) => Number(el.ID) === Number(featuredID));
    setFeaturedComp(c);
  }, [competitions, featuredID]);

  useEffect(() => {
    const id = appOptions?.most_featured_competition_id;
    if (id) setFeaturedID(Number(id));
  }, [appOptions]);

  useEffect(() => {
    setError(null);
    setNewFeaturedComp(null);
    if (newFeaturedID) {
      const c = competitions?.find(
        (el) => Number(el.ID) === Number(newFeaturedID)
      );
      if (!c?.ID) {
        setError("no competition with this id");
        return;
      }
      setError(null);
      setNewFeaturedComp(c);
    }
  }, [newFeaturedID, competitions]);

  const onFormChange = (e) => {};

  const saveNewMostFeaturedCompetition = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setWait(true);
    const r = await dispatch(
      (appOptions.most_featured_competition_id ? updateAppOption : addAppOption)("most_featured_competition_id", String(newFeaturedID))
    );
    if (r.error) {
      setError(r.error);
      setWait(false);
      return;
    }

    setSuccess("done, new most featured competition has been assigned");
    setWait(false);
  };

  return (
    <>
      {wait ? (
        <Loading />
      ) : (
        <form className="needs-validation p-2">
          <h4>Competition with timer at the front page</h4>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show text-center">
              {success}
            </div>
          )}

          <div className="row mb-4">
            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                competition ID:
              </label>
              <input
                className="form-control"
                type="text"
                id="priceProductCreate"
                placeholder=""
                name="competition.price"
                value={featuredComp?.ID}
                onChange={onFormChange}
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                Competition Title:
              </label>
              <input
                className="form-control"
                type="text"
                id="priceProductCreate"
                placeholder=""
                name="competition.price"
                value={featuredComp?.title}
                onChange={onFormChange}
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="priceProductCreate">
                New Featured competition ID:
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
                New Featured competition Title:
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
                onClick={saveNewMostFeaturedCompetition}
              >
                Save New Featured competition
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
