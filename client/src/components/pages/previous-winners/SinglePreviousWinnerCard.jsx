import React from "react";
import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";

export default function SinglePreviousWinnerCard({ comp }) {
  const screen = useScreenSize();
  return (
    <React.Fragment>
      <div
        className="cs-grid-item hand-hover m-auto"
        data-groups='["3d"]'
        style={{
          width: screen === "phone" ? "75vw" : "",
          margin: screen === "phone" ? "0 auto " : "",
          float: screen === "phone" ? "none " : "",
        }}
      >
        <div className="card card-curved-body box-shadow card-slide">
          <div className="card-slide-inner">
            <img
              className="card-img"
              src={comp.featured_image}
              alt="Portfolio thumb"
              style={{ display: "block", height: "auto" }}
            />

            <Link
              className="card-body text-center"
              to={`/previous-winner/${comp.ID}`}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <h3 className="h5 nav-heading mt-1 mb-2">
                {comp?.winner?.first_name + " " + comp?.winner?.last_name}
              </h3>
              <p className="font-size-sm text-muted mb-1">
                won a {comp?.title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
