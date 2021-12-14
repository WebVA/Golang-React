import React from 'react';
import { _appOptions } from '../../../../app/appState/appSlice';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function RewardsInformationContent() {
    const { reward_points_per_social_share } = useSelector(_appOptions);
    const history = useHistory();

    return (
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
            <div className="py-2 p-md-3">
                {/* Title + Filters */}
                <div className="d-sm-flex align-items-center justify-content-between pb-2">
                    <h1 className="h3 mb-3 text-center text-sm-left">
                        Rewards Information
                    </h1>
                </div>
                {/* Content */}
                <h1 className="h6 mb-3 text-sm-left">
                    Earn rewards as you spend!
                </h1>
                <p className="font-size-sm">
                    We wanted to give back to our loyal customers.
                    So we introducted reward points.
                    You can spend these points on discounts for future orders,
                    you can give this to your friends/family!
                </p>
                <h1 className="h6 mb-3 text-sm-left">
                    How to use!
                </h1>
                <p className="font-size-sm">
                    Once you have enough points to redeem you will be able to press the redeem button,
                    you can see the number of points you need in the middle of each reward.
                </p>
                <p className="font-size-sm">
                    Your number of reward points are displayed at the top right on the rewards page.
                </p>
                <p className="font-size-sm">
                    When you've redeemed the selected reward,
                    you will be displayed a code which you can use on any checkout within 14 days.
                    You will also receive an email with the reward information.</p>

                <h1 className="h6 mb-3 text-sm-left">
                    Rewards for sharing!
                </h1>
                <p className="font-size-sm">
                    We have implemented a system where you earn reward points
                    when sharing our page to your social media accounts.
                </p>
                <p className="font-size-sm">
                    You currently earn {reward_points_per_social_share ? reward_points_per_social_share : 5} per valid social share!
                </p>
                <button
                    className="btn btn-outline-primary btn-sm"
                    type="button"
                    onClick={() => history.push("/account/rewards")}
                >
                    Back to rewards
                </button>
                
            </div>
        </div>
    )
}
