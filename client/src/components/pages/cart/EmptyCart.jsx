import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="container py-5 py-sm-6 py-md-7">
      <div className="row justify-content-center pt-4">
        <div className="col-lg-7 col-md-9 col-sm-11">
          <div className="h2 text-center">
            <i
              className="far fa-frown mr-3 text-danger"
              style={{ fontSize: "1em" }}
            ></i>
          </div>
          <div className="h2 text-center pb-2">Your cart is empty!</div>
          <p className="font-size-md text-center">
            You must add some competitions to your cart before proceeding.
          </p>
          <p className="font-size-md text-center pb-3">
            You will find a lot of interesting competitions on our running
            competition page.
          </p>
          <div className="text-center py-3 pb-md-0">
            <Link to="/running-competitions" className="btn btn-primary">
              Return To Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
