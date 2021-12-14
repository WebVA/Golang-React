import React, { useState, useEffect } from "react";
import { _appOptions, addAppOption, updateAppOption } from "../../../app/appState/appSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../pages/layout/Loading";

export default function AssignWinnerForm() {
  const appOptions = useSelector(_appOptions);
  const [newRewardPoints, setNewRewardPoints] = useState(5);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (appOptions['reward_points_per_social_share']) {
      setNewRewardPoints(+appOptions['reward_points_per_social_share']);
    }
  }, [appOptions]);

  const saveNewRewardPointsPerShare = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setWait(true);
    const r = await dispatch(
      (appOptions['reward_points_per_social_share'] ? updateAppOption : addAppOption)("reward_points_per_social_share", String(newRewardPoints))
    );
    if (r.error) {
      setError(r.error);
      setWait(false);
      return;
    }

    setSuccess("done, new reward points has been assigned per social share");
    setWait(false);
  };

  return (
    <>
      {wait ? (
        <Loading />
      ) : (
        <form className="needs-validation p-2">
          <h4>Reward points per social share</h4>
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
              <label className="form-label" htmlFor="rewardPoints">
                New Reward Points :
              </label>
              <input
                className="form-control"
                type="text"
                id="rewardPoints"
                placeholder=""
                name="competition.price"
                value={newRewardPoints}
                onChange={(e) => setNewRewardPoints(Number(e.target.value))}
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label className="form-label" htmlFor="saveNewRewardPointsButton">
                Save when you done :
              </label>

              <button
                id="saveNewRewardPointsButton"
                className="btn btn-primary"
                disabled={!newRewardPoints}
                onClick={saveNewRewardPointsPerShare}
              >
                Save New RewardPoints
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
