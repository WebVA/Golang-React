/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import SingleOrder from "./SingleOrder";
import {
  _orders,
  getAllOrdersFromServer,
} from "../../../../app/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../layout/Loading";
import { _loggedIn, _profile } from "../../../../app/user/userSlice";
import { useHistory } from "react-router-dom";
import NoOrders from "./NoOrders";

export default function Orders() {
  const orders = useSelector(_orders);
  const loggedIn = useSelector(_loggedIn);
  const history = useHistory();
  const profile = useSelector(_profile);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    (async () => {
      if (profile?.ID) {
        setWait(true);
        const res = await dispatch(getAllOrdersFromServer(profile.ID));
        setWait(false);
      }
    })();
  }, [profile]);

  if (!loggedIn) {
    history.push("/login");
  }

  const slicedOrders = orders?.slice(0, limit);

  return (
    <>
      <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
        <div className="py-2 p-md-3">
          {/* <!-- Title + Filters--> */}
          <div className="d-sm-flex align-items-center justify-content-between pb-2">
            <h1 className="h3 mb-3 text-center text-sm-left">Orders</h1>
          </div>
          {/* <!-- Accordion with orders--> */}
          {wait ? (
            <Loading />
          ) : (
            <>
              <div className="accordion" id="orders-accordion">
                {/* Order expanded */}
                {slicedOrders?.map((o, i) => {
                  return <SingleOrder key={"order" + i} order={o} />;
                })}
              </div>
              {orders?.length === 0 && <NoOrders />}
              {/* <!-- Pagination--> */}
              {orders.length > 0 && (
                <nav className="d-md-flex justify-content-between align-items-center text-center text-md-left pt-grid-gutter">
                  <div className="d-md-flex align-items-center w-100">
                    <span className="font-size-sm text-muted mr-md-3">
                      Showing {limit > orders?.length ? orders?.length : limit}{" "}
                      of {orders.length} orders
                    </span>
                    <div
                      className="progress w-100 my-3 mx-auto mx-md-0"
                      style={{ maxWidth: "10rem", height: "4px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${
                            orders.length > 0
                              ? Math.floor((limit / orders.length) * 100)
                              : 0
                          }%`,
                        }}
                        aria-valuenow={
                          orders.length > 0
                            ? Math.floor((limit / orders.length) * 100)
                            : 0
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  {orders.length > limit && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      type="button"
                      onClick={() => setLimit(limit * 2)}
                    >
                      Load more orders
                    </button>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
