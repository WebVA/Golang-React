import React from "react";
import { Link } from "react-router-dom";

export default function BreadCrumbs({ crumbs }) {
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="py-1 my-2 breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          {crumbs.map((cr, i) => (
            <React.Fragment key={ `bread-crumbs-` + i}>
              {i === crumbs.length - 1 ? (
                <li className="breadcrumb-item active">{cr.title}</li>
              ) : (
                <li className="breadcrumb-item">
                  <Link to={cr.to}>{cr.title}</Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
}
