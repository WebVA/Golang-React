import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPayment({ error }) {
  return (
    <>
      <div
        className="container d-flex flex-column justify-content-center pt-5 mt-n6"
        style={{ flex: "1 0 auto" }}
      >
        <div className="pt-7 pb-5">
          <div className="text-center mb-2 pb-4">
            <h1 className="mb-grid-gutter">
              <img
                className="d-inline-block"
                src="/img/pages/404/404-illustration.svg"
                alt="Error 404"
              />
              <span className="d-block pt-3 font-size-sm font-weight-semibold text-danger">
                Error.
              </span>
            </h1>
            <h2>{error}</h2>
            {/* <p className="pb-2">
              `It seems we can’t find the page you are looking for.`
            </p> */}
            <Link
              className="btn btn-translucent-primary mr-3"
              to="/account/orders"
            >
              check your orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
