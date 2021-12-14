/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _featuredCompetitions } from "../../../app/competition/competitionSlice";
import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize.jsx";
import endpoints from '../../../app/constants/endpoints';

const fill_Line = {
  height: "20px",
  width: "90%",
  backgroundColor: "rgba(250, 250, 250, 0.6)"
}

export default function FeaturedProducts({ limit = 3 }) {
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const featuredCompetitions = useSelector(_featuredCompetitions);
  const [selectedComp, setSelectedComp] = useState({});
  const screenSize = useScreenSize();

  useEffect(() => {
    if (limit) {
      const temp = featuredCompetitions.slice(0, limit);
      setFilteredCompetitions(temp);
    } else {
      setFilteredCompetitions(featuredCompetitions);
    }
  }, [featuredCompetitions, limit]);

  useEffect(() => {
    setSelectedComp(filteredCompetitions[0] || {});
  }, [filteredCompetitions]);

  return (
    <>
      {/* <!-- Hero - Featured Products (tabs)--> */}
      <section className="position-relative bg-gradient pt-5 pt-lg-6 pb-7 mb-7" style={{ minHeight: screenSize === 'phone' ? "100vh" : "40vh" }} >
        <div className="cs-shape cs-shape-bottom cs-shape-curve bg-body">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 185.4">
            <path
              fill="currentColor"
              d="M3000,0v185.4H0V0c496.4,115.6,996.4,173.4,1500,173.4S2503.6,115.6,3000,0z"
            ></path>
          </svg>
        </div>
        {/* <!-- Tabs--> */}
        <div className="container pb-7">
          <div className="row align-items-center pb-7">
            <div className="col-lg-3">
              <ul
                className="nav nav-tabs cs-media-tabs cs-media-tabs-light justify-content-center justify-content-lg-start pb-3 mb-4 pb-lg-0 mb-lg-0"
                role="tablist"
              >
                {/* placeHolder Text */}
                {
                  !filteredCompetitions.length && [0, 1, 2].map(n => <>
                    <li
                      key={"list-featured-competitions-" + n}
                      className="nav-item mb-3 hand-hover"
                      style={{ width: "16.25rem" }}
                    >

                      <a
                        className={`nav-link`}
                        data-toggle="tab"
                        role="tab"
                        href=""
                        aria-selected={0}
                      >
                        <div className="media align-items-center">
                          <img
                            className="rounded"
                            width="60"
                            height="60"
                            src={endpoints.defaultCompetitionImage}
                            alt="Product"
                          />
                          <div className="media-body pl-2 ml-1">
                            <div className="d-flex justify-content-between align-items-center ">
                              <div className="font-size-sm pr-1 fill_line" style={{ ...fill_Line }}>{"   "}</div>
                              <i className="fe-chevron-right lead ml-2 mr-1"></i>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>

                  </>)
                }
                {filteredCompetitions?.map((c, i) => {
                  return (
                    <li
                      key={"list-featured-competitions-" + i}
                      className="nav-item mb-3 hand-hover"
                      style={{ width: "16.25rem" }}
                      onClick={() => {
                        setSelectedComp(c);
                      }}
                    >
                      <a
                        className={`nav-link ${selectedComp.ID === c.ID ? "active" : ""
                          }`}
                        href={"#comp" + c.ID}
                        data-toggle="tab"
                        role="tab"
                        aria-selected={selectedComp.ID === c.ID}
                      >
                        <div className="media align-items-center">
                          <img
                            className="rounded"
                            width="60"
                            height="60"
                            src={c.featured_image}
                            alt="Product"
                            style={{ width: "60px", height: "60px" }}
                          />
                          <div className="media-body pl-2 ml-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="font-size-sm pr-1 ">{c.title}</div>
                              <i className="fe-chevron-right lead ml-2 mr-1"></i>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-lg-9">
              <div className="tab-content">
                {!filteredCompetitions.length && <>
                  <div
                    className={`tab-pane fade show active`}
                  >
                    <div className="row align-items-center">
                      <div className="col-lg-6 order-lg-2 pb-1 mb-4 pb-lg-0 mb-lg-0">
                        <div
                          className="mx-auto"
                          style={{

                            width: screenSize === "desktop" ? "20vw" : "80vw",
                          }}
                        >
                          <img
                            src={endpoints.defaultCompetitionImage}
                            alt="Security Camera"
                            className="rounded"
                            width="100%"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 order-lg-1 text-center text-lg-left">
                        <div className="pl-xl-5">
                          {[1, 2, 3, 4].map(e => <p key={"x-" + e} className="font-size-lg text-light mb-lg-5" style={{ ...fill_Line }}>  </p>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>}
                {filteredCompetitions?.map((c, i) => {
                  return (
                    <div
                      className={`tab-pane fade  ${selectedComp?.ID === c.ID ? "show active" : ""
                        }`}
                      key={"expanded-comp-featured" + i}
                      id={"comp" + c.ID}
                    >
                      <div className="row align-items-center">
                        <div className="col-lg-6 order-lg-2 pb-1 mb-4 pb-lg-0 mb-lg-0">
                          <div
                            className="mx-auto"
                            style={{
                              // maxWidth: "30vw",
                              // minWidth: "20vw",
                              width: screenSize === "desktop" ? "20vw" : "80vw",
                              // minHeight: '20vh',
                            }}
                          >
                            <a href={`/competition/${c.ID}`}>
                              <img
                                src={c.featured_image}
                                alt={c.title}
                                className="rounded"
                                width="100%"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-6 order-lg-1 text-center text-lg-left">
                          <div className="pl-xl-5">
                            <h2 className="h1 text-light">{c.title}</h2>
                            <p className="font-size-lg text-light mb-lg-5">
                              {c.description}
                            </p>
                            <Link
                              className="btn btn-translucent-light"
                              to={`/competition/${c.ID}`}
                              onClick={() => {
                                window.scrollTo(0, 0);
                              }}
                            >
                              Enter now | £{c.reduced_price || c.price} per
                              ticket
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
