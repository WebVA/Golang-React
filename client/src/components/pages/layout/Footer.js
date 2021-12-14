import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="cs-footer">
        <div className="bg-darker pt-2">
          <div className="container py-sm-3">
            <div className="row pb-4 mb-2 pt-5 py-md-5">
              <div className="col-md-3 col-sm-6 mb-4">
                <div className="media align-items-center">
                  <i
                    className="fe-award text-primary"
                    style={{ fontSize: "2.125rem" }}
                  ></i>
                  <div className="media-body pl-3">
                    <h6 className="font-size-base text-light mb-1">
                      User rewards
                    </h6>
                    <p className="mb-0 font-size-xs text-light opacity-50">
                      Rewards for our repeat customers
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-4">
                <div className="media align-items-center">
                  <i
                    className="fe-tablet text-primary"
                    style={{ fontSize: "2.125rem" }}
                  ></i>
                  <div className="media-body pl-3">
                    <h6 className="font-size-base text-light mb-1">
                      Device friendly
                    </h6>
                    <p className="mb-0 font-size-xs text-light opacity-50">
                      Website built to run on all devices
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-4">
                <div className="media align-items-center">
                  <i
                    className="fe-life-buoy text-primary"
                    style={{ fontSize: "2.125rem" }}
                  ></i>
                  <div className="media-body pl-3">
                    <h6 className="font-size-base text-light mb-1">
                      24/7 customer support
                    </h6>
                    <a href="mailto: help@comp-performance.co.uk">
                      <p className="mb-0 font-size-xs text-light opacity-50">
                        help@comp-performance.co.uk
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-4">
                <div className="media align-items-center">
                  <i
                    className="fe-credit-card text-primary"
                    style={{ fontSize: "2.125rem" }}
                  ></i>
                  <div className="media-body pl-3">
                    <h6 className="font-size-base text-light mb-1">
                      Secure online payment
                    </h6>
                    <p className="mb-0 font-size-xs text-light opacity-50">
                      Using the latest SSL сertificate
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="hr-light mb-5" />
            <div className="d-sm-flex align-items-center mb-4 pb-3">
              <div className="d-flex flex-wrap align-items-center mr-3">
                <Link
                  className="d-block mr-grid-gutter mt-n1 mb-3"
                  to="/"
                  style={{ width: "175px" }}
                >
                  <img
                    src="/img/logo/logo-footer-alt.png"
                    alt="Comp Performance"
                  />
                </Link>
                <ul className="list-inline font-size-sm pt-2 mb-3">
                  <li className="list-inline-item">
                    <Link className="nav-link-style nav-link-light" to="/about">
                      About
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      className="nav-link-style nav-link-light"
                      to="/running-competitions"
                    >
                      Running Competitions
                    </Link>
                  </li>
                  {/* <li className="list-inline-item">
                    <Link
                      className="nav-link-style nav-link-light"
                      to="/previous-winners"
                    >
                      Previous Winners
                    </Link>
                  </li> */}
                  <li className="list-inline-item">
                    <Link
                      className="nav-link-style nav-link-light"
                      to="/account/orders"
                    >
                      Account
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link className="nav-link-style nav-link-light" to="/tcs">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="d-flex pt-2 pt-sm-0 ml-auto">
                <a
                  className="social-btn sb-twitter sb-light mr-2 mb-2"
                  href="https://twitter.com/CompPerfUK"
                >
                  <i className="fe-twitter"></i>
                </a>
                <a
                  className="social-btn sb-facebook sb-light mr-2 mb-2"
                  href="https://www.facebook.com/CompPerformance"
                >
                  <i className="fe-facebook"></i>
                </a>
                <a
                  className="social-btn sb-instagram sb-light mr-2 mb-2"
                  href="https://www.instagram.com/compperformanceltd/"
                >
                  <i className="fe-instagram"></i>
                </a>
              </div>
            </div>
            <div className="d-sm-flex justify-content-between align-items-center pb-4 pb-sm-2">
              <div className="order-sm-2 mb-4 mb-sm-3">
                {/* <img
                  width="181"
                  src="img/footer/cards.png"
                  alt="Payment methods"
                /> */}
              </div>
              <div className="order-sm mb-0">
                <li className="d-flex align-items-center">
                  <i className="fe-mail mr-1 pb-1"></i>
                  <a href="mailto: sales@comp-performance.co.uk">
                    <p className="font-size-sm mb-1">
                      <span className="text-light opacity-50 mr-1">
                        sales@comp-performance.co.uk
                      </span>
                    </p>
                  </a>
                </li>
                <p className="font-size-sm mb-0">
                  <span className="text-light opacity-50 mr-1">
                    © All rights reserved. Made by Comp Performance
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
