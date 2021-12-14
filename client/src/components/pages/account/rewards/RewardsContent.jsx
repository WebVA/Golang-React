import React, { useEffect, useState } from 'react';
import { _userRewardPoints } from '../../../../app/user/userSlice.js'
import { useSelector, useDispatch } from "react-redux";
import { _prizes, getAllPrizesFromServer } from '../../../../app/prize/prizeSlice.js'
import SingleRewardCard from './SingleRewardCard.jsx';
import { useHistory } from "react-router-dom";

export default function RewardsContent() {
    const userRewardPoints = useSelector(_userRewardPoints);
    const prizes = useSelector(_prizes);
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(2);
    const history = useHistory();

    useEffect(() => {
        dispatch(getAllPrizesFromServer())
    }, [])

    return (
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
            <div className="py-2 p-md-3">

                <div className="d-sm-flex align-items-center justify-content-between pb-2">
                    <h1 className="h3 mb-3 text-center text-sm-left">Rewards</h1>
                    <div className="mb-3 font-weight-medium">Number of points: <span className="text-primary">{userRewardPoints}</span>!</div>
                </div>

                {prizes
                    .filter(p => p.points_required)
                    .slice(0, limit)
                    .map(p => <SingleRewardCard prize={p} />)
                }

                <div className="d-sm-flex align-items-center justify-content-between pb-2 mt-4">
                    {/* <pre>{JSON.stringify({
                        coupon,
                    }, null, 4)}</pre> */}
                </div>
                {prizes.filter(p => p.points_required).length > limit && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      type="button"
                      onClick={() => setLimit(limit * 2)}
                    >
                        Load more rewards
                    </button>
                )}
                <button
                  className="btn btn-outline-primary btn-sm float-right"
                  type="button"
                  onClick={() => history.push("/account/rewards/information")}
                >
                    Reward Information
                </button>
            </div>
        </div>
    )
}
