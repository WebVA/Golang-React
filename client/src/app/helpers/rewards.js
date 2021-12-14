import { convertFloatPriceToInt } from './utils';

export const calculateOrderRewardPoints = (orderTotal) => {
    /*** add 1 point for each   */
    return Math.floor(orderTotal)
}

export const calculateAmountOff = (points) => {
    let pounds = Math.floor(points / 100);
    const remainingPoints = points - (pounds * 100);

    pounds = convertFloatPriceToInt(pounds); // stripe requires price in cents

    return { pounds, remainingPoints }
}

export const checkIfPrizeClaimable = (prize, userPoints) => {
    if (Number(prize.points_required) <= Number(userPoints)) {
        return true;
    }

    return false;
}