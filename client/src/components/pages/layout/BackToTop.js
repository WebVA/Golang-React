import React from "react";

export default function BackToTop() {
  return (
    <>
      {/* <!-- Back to top button--> */}
      <a className="btn-scroll-top" href="#top" data-scroll>
        <span className="btn-scroll-top-tooltip text-muted font-size-sm mr-2">
          Top
        </span>
        <i className="btn-scroll-top-icon fe-arrow-up"> </i>
      </a>
    </>
  );
}
