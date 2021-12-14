import React from "react";
import { Link } from "react-router-dom";

export default function NoOrders() {
  return (
    <div class="row justify-content-center pt-4">
      <div class="col-lg-7 col-md-9 col-sm-11">
        <div class="h2 text-center">
          <i
            class="fe-shopping-cart text-danger"
            style={{ fontSize: "1em" }}
          ></i>
        </div>
        <div class="h2 text-center pb-2">You don't have any orders yet!</div>
        <p class="font-size-md text-center pb-3">
          You will find a lot of interesting competitions on our running
          competition page.
        </p>
        <div class="text-center py-3 pb-md-0">
          <Link class="btn btn-primary" to="/running-competitions">
            Return To Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
