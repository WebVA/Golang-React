import React from "react";
import { Link } from "react-router-dom";

export default function SingleCompetition({ url, image, title }) {
  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
        <div
          className="card card-product card-hover"
          style={{ display: "block", height: "20rem" }}
        >
          <Link
            className="card-img-top"
            to={url}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={image}
              style={{ display: "block", height: "16rem" }}
              alt="Product thumbnail"
            />
          </Link>
          <div className="card-body">
            <h3 className="font-size-md font-weight-medium mb-2">
              <Link
                className="meta-link"
                to={url}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                {title}
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
