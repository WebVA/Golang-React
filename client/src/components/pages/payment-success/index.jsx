/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import queryString from "query-string";

import { saveOrderToDB } from "../../../app/order/orderSlice";
import { clearCompCart, _compCart } from "../../../app/compCart/cartSlice";
import {
  _profile,
  UpdateRewardPointsToUserAccount,
  _userRewardPoints
} from "../../../app/user/userSlice";
import { _appOptions } from "../../../app/appState/appSlice";

import Loading from "../layout/Loading";

import { displayPrice } from '../../../app/helpers/utils'
import { calculateOrderRewardPoints } from '../../../app/helpers/rewards.js'

import ErrorPayment from "./ErrorPayment";

export default function SuccessPage() {
  const searchParams = queryString.parse(window.location.search);
  const sessionID = searchParams.session_id.trim();
  const dispatch = useDispatch();
  const [session, setSession] = useState({});
  const [orderDetails, setOrderDetails] = useState({
    items: {},
    count: 0,
    total: 0,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const compCart = useSelector(_compCart);
  const [dbOrder, setDbOrder] = useState(null);
  const [wait, setWait] = useState(false);
  const userRewardPoints = useSelector(_userRewardPoints);
  const [newUserRewardPoints, setNewUserRewardPoints] = useState(0);
  const [pointsAdded, setPointsAdded] = useState(0);
  const profile = useSelector(_profile);
  const appOptions = useSelector(_appOptions);

  const printArray = (array) => {
    return array.join(", ");
  };

  if (!sessionID) {
    <Redirect to="/" />;
  }

  useEffect(() => {
    (async () => {
      setWait(true);
      setSuccess(false);
      setError("");

      setOrderDetails(compCart);

      if (!sessionID) {
        setError("session ID is empty, check again.");
        setWait(false);
        return;
      }

      const savedSessionId = localStorage.getItem('sessionId');

      if (savedSessionId !== sessionID) {
        // if (res.statusCode === 401) {
        //   setError("You are unauthorized. Please Sign in.");
        // } else {
        //   setError("Get session: " + res.error);
        // }
        setError("Invalid session.");
        setWait(false);
        return;
      }

      const thisSession = {
        id: sessionID,
        amount_total: localStorage.getItem("totalAmount") * 100,
        amount_subtotal: localStorage.getItem("subTotalAmount") * 100,
        payment_status: "paid",
      };
      setSession(thisSession);

      if (thisSession.payment_status === "paid") {
        const r = await dispatch(saveOrderToDB(thisSession));
        if (r.error) {
          setError("Save order to DB: " + r.error);
          setWait(false);
          return;
        }
        setDbOrder(r.result);
        const points = calculateOrderRewardPoints(r.result?.total);
        dispatch(UpdateRewardPointsToUserAccount(points + userRewardPoints));
        setNewUserRewardPoints(points + userRewardPoints);
        setPointsAdded(points);
        dispatch(clearCompCart());
        setError("");
        setSuccess(true);
        setWait(false);
      } else {
        setError("un-successful transaction, please call the Admin");
        setWait(false);
      }
    })();
  }, [sessionID]);

  const shareUrl = window.location.host;
  const handleSharePressed = () => {
    if (!profile) return;
    let newRewards = 5;
    if (+appOptions['reward_points_per_social_share']) {
      newRewards = +appOptions['reward_points_per_social_share'];
    }
    dispatch(UpdateRewardPointsToUserAccount(profile.reward_points + newRewards));
  }

  return (
    <div className="full-height">
      <div className="container py-5 py-sm-6 py-md-7">
        {wait ? (
          <Loading />
        ) : (
          <>
            {error ? (
              <>
                <ErrorPayment error={error} />
              </>
            ) : (
              <div className="row justify-content-center pt-4">
                <div className="col-lg-7 col-md-9 col-sm-11">
                  {success && (
                    <>
                      <div className="h2 text-center">
                        <i
                          className="far fa-check-circle mr-3 text-success"
                          style={{ fontSize: "1em" }}
                        ></i>
                        Payment Successful!
                      </div>
                      <p
                        className="font-size-sm text-center pb-3"
                        style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                      >
                        Payment Ref: {dbOrder?.ID}
                      </p>
                      <p className="font-size-md text-center">
                        We'll email you an order confirmation with the details
                        of your purchase.
                      </p>
                      <p className="font-size-md text-center">
                        Keep an eye on our socials for news on the draw date,
                        good luck!
                      </p>

                      <p className="font-size-md text-center text-uppercase font-weight-bold m-0">
                        Share this to your social media for extra reward points!
                      </p>

                      <div className="pb-3 d-flex justify-content-center">
                        <FacebookShareButton
                          url={shareUrl}
                          className="social-btn sb-outline sb-facebook mr-2 my-2"
                          onClick={() => handleSharePressed()}
                        >
                          <i className="fe-facebook"></i>
                        </FacebookShareButton>
                        <TwitterShareButton
                          className="social-btn sb-outline sb-twitter mr-2 my-2"
                          url={shareUrl}
                          onClick={() => handleSharePressed()}
                        >
                          <i className="fe-twitter"></i>
                        </TwitterShareButton>
                        {/* <a className="social-btn sb-outline sb-google mr-2 my-2">
                          <i className="fe-google"></i>
                        </a> */}
                      </div>

                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <td colSpan={4} className="text-center m-auto">
                              Order Details
                            </td>
                          </tr>
                          <tr>
                            <th>Product ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(orderDetails?.items).map((sku) => {
                            const item = orderDetails.items[sku];
                            return (
                              <tr key={"item-cart-sku" + sku}>
                                <td>{sku}</td>
                                <td>
                                  <p className="font-size-sm strong">
                                    {item.name}
                                  </p>
                                  <p>
                                    Answer:{" "}
                                    {
                                      item?.competition?.quiz[
                                      `option${item?.given_answer}`
                                      ]
                                    }
                                  </p>
                                  <p>Tickets: {printArray(item.tickets)}</p>
                                </td>
                                <td>{item.quantity}</td>
                                <td>{displayPrice(item.price)}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td colSpan="2">
                              No. Of Competitions: {orderDetails?.count}
                            </td>{
                              [1].map(n => {
                                const stripeTotalPrice = (session.amount_total / 100); //the amount the user actual paid
                                const stripeBeforeCouponPrice = (session.amount_subtotal / 100); // the amount before applying coupons
                                return (
                                  <React.Fragment>
                                    {Number(stripeTotalPrice) === Number(stripeBeforeCouponPrice) ? <td colSpan="2"> Total: {displayPrice(stripeTotalPrice)} </td> : <></>}
                                    {Number(stripeTotalPrice) !== Number(stripeBeforeCouponPrice) ? <td colSpan="2">
                                      Total:<del className="ml-2 mr-2"> {displayPrice(stripeBeforeCouponPrice)}</del>
                                      <span>{displayPrice(stripeTotalPrice)}</span>
                                    </td> : <></>}
                                  </React.Fragment>
                                )
                              })

                            }

                          </tr>
                          {(pointsAdded && userRewardPoints) ? <tr>
                            <td colSpan="4">
                              A total of {pointsAdded} points have been added to your profile, your new number of points is {newUserRewardPoints}!
                            </td>
                          </tr> : <></>
                          }
                        </tbody>
                      </Table>

                      <br />

                      <Link
                        className="btn btn-primary btn-block"
                        type="submit"
                        to="/running-competitions"
                      >
                        Continue Shopping
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* <pre>
        {JSON.stringify(
          {
            session,
            orderDetails,
            order: JSON.parse(localStorage.getItem("order")),
          },
          null,
          4
        )}
      </pre> */}
    </div>
  );
}
