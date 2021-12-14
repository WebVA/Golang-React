import React from "react";
import { Link } from "react-router-dom";
import { createdLessThanWeekAgo } from "../../../app/helpers/utils";

export default function SingleCompetition({ comp }) {
  const title = comp?.title;
  const category = comp?.category ? comp.category.name : "";
  const price = comp?.price;
  const competitionUrl = `competition/${String(comp?.ID)}`;
  const featuredImageUrl = comp?.featured_image;
  const reducedPrice = comp?.reduced_price;
  const brandNew = createdLessThanWeekAgo(comp?.CreatedAt);

  return (
    <>
      <div className="col mb-grid-gutter">
        <div
          className="card card-product card-hover"
          style={{ display: "block", height: "auto" }}
        >
          {!reducedPrice && brandNew && (
            <span className="badge badge-floating badge-pill badge-success">
              New
            </span>
          )}
          {reducedPrice ? (
            <span className="badge badge-floating badge-pill badge-danger">
              sale{" "}
            </span>
          ) : (
            <></>
          )}
          <Link
            className="card-img-top"
            to={"/" + competitionUrl}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={featuredImageUrl}
              style={{ display: "block", height: "auto" }}
              alt="Product thumbnail"
            />
          </Link>
          <div className="card-body">
            <Link
              className="meta-link font-size-xs mb-1"
              to={"/" + competitionUrl}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              {category}
            </Link>
            <h3 className="font-size-md font-weight-medium mb-2">
              <Link
                className="meta-link"
                to={"/" + competitionUrl}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                {title}
              </Link>
            </h3>
            {reducedPrice ? (
              <del className="font-size-sm text-muted mr-1">£{price}</del>
            ) : (
              <></>
            )}
            <span className="text-heading font-weight-semibold">
              £{reducedPrice ? reducedPrice : price}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
