import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <div
        class="container d-flex flex-column justify-content-center pt-5 mt-n6"
        style={{flex: "1 0 auto"}}
      >
        <div class="pt-7 pb-5">
          <div class="text-center mb-2 pb-4">
            <h1 class="mb-grid-gutter">
              <img
                class="d-inline-block"
                src="/img/pages/404/404-illustration.svg"
                alt="Error 404"
              />
              <span class="sr-only">Error 404</span>
              <span class="d-block pt-3 font-size-sm font-weight-semibold text-danger">
                Error code: 404
              </span>
            </h1>
            <h2>Page not found!</h2>
            <p class="pb-2">
              It seems we can’t find the page you are looking for.
            </p>
            <Link class="btn btn-translucent-primary mr-3" to="/">
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
