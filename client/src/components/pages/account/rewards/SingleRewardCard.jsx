import { displayPrice } from '../../../../app/helpers/utils';
import { convertIntPriceToNormal, convertFloatPriceToInt } from '../../../../app/helpers/utils.js';
import React, { useEffect, useState } from 'react';
import { UpdateRewardPointsToUserAccount, _userRewardPoints, createStripeCoupon } from '../../../../app/user/userSlice.js'
import { useSelector, useDispatch } from "react-redux";
import { calculateAmountOff, checkIfPrizeClaimable } from '../../../../app/helpers/rewards.js'
import ErrorMessage from "../../../shared/ErrorMessage";
import { PRIZE_TYPES } from '../../../../app/constants/constants'

export default function SingleRewardCard({ prize }) {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [possibleAmountOff, setPossibleAmountOff] = useState(0);
    const [possibleRemainingPoints, setPossibleRemainingPoints] = useState(0);
    const dispatch = useDispatch();
    const [coupon, setCoupon] = useState({});
    const userRewardPoints = useSelector(_userRewardPoints);
    const [prizeClaimable, setPrizeClaimable] = useState(false);




    useEffect(() => {
        const { pounds, remainingPoints } = calculateAmountOff(userRewardPoints);
        setPossibleAmountOff(pounds);
        setPossibleRemainingPoints(remainingPoints);
        setPrizeClaimable(checkIfPrizeClaimable(prize, userRewardPoints))
    }, [userRewardPoints]);


    const redeem = async (e) => {
        e.preventDefault();
        // const { pounds, remainingPoints } = calculateAmountOff(userRewardPoints);
        const remainingPoints = userRewardPoints - Number(prize.points_required);

        if (remainingPoints < 0) {
            setError('you cant claim this prize');
            return;
        }
        const prizeToSendToStripe = {
            type: prize.type,
        };

        if (prize.type === PRIZE_TYPES.amount_off) {
            prizeToSendToStripe.amount_off = convertFloatPriceToInt(prize.prize_value)
        }

        if (prize.type === PRIZE_TYPES.percent_off) {
            prizeToSendToStripe.percent_off = Number(prize.prize_value)
        }
        const rCoupon = await dispatch(createStripeCoupon(prizeToSendToStripe));

        if (rCoupon.error) {
            setError(rCoupon.error);
            return;
        }

        setCoupon({ ...rCoupon.result });

        await dispatch(UpdateRewardPointsToUserAccount(remainingPoints));
        setSuccess(true)
    }
    return (
        <>
            <div className="d-sm-flex align-items-start justify-content-between border-bottom py-4 py-sm-5">

                {error ? <ErrorMessage msg={error} /> : <></>}

                <div className="ml-4 ml-sm-0 py-2" style={{ width: "10rem" }}>
                    <h4 className="mb-2">{prize.title}</h4>
                    <div className="font-size-xs">{prize.description} </div>
                </div>
                <div className="d-flex align-items-end py-3 py-sm-2 px-4">
                    <span className="cs-price display-2 font-weight-normal text-primary px-1 mr-2">{prize.points_required}</span>
                    <span className="h3 font-size-lg font-weight-medium text-muted mb-2">points</span>
                </div>
                <div className="py-2 mb-0 text-center py-3 py-sm-2 px-4">
                    <button
                        className="btn btn-outline-primary"
                        onClick={redeem}
                        disabled={!prizeClaimable}
                    >Redeem</button>
                </div>
            </div>



            {success ? <div className="d-sm-flex align-items-start justify-content-between border-bottom py-4 py-sm-5">
                <div className="ml-4 ml-sm-0 py-2" style={{ width: "10rem" }}>
                    <h3 className="mb-2">Coupon ID</h3>
                    <div className="font-size-xs">We've sent you an email with this coupon. It will be valid for 14 days. Please refer to 'Reward Info' button below on how to use it. </div>
                </div>
                <div className="d-flex align-items-end py-3 py-sm-2 px-4">
                    <span className="cs-price display-2 font-weight-normal text-primary px-1 mr-2">{coupon?.coupon_code}</span>
                </div>
                <div className="py-2 mb-0 text-center py-3 py-sm-2 px-4">
                </div>
            </div>
                : <></>
            }



        </>
    )
}
