/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  _competitions,
  getCompetitionById,
} from "../../../app/competition/competitionSlice";
import { _loading, _appOptions } from "../../../app/appState/appSlice";
import Loading from "../layout/Loading";
import { findNewCompetitions } from "../../../app/helpers/competitions-algorithms";
import { countdown } from "../../../app/helpers/utils";
import { Link } from "react-router-dom";

export default function NewArrivals({ limit = 6 }) {
  const competitions = useSelector(_competitions);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector(_loading);
  const [featuredID, setFeaturedID] = useState(0);
  const [featuredComp, setFeaturedComp] = useState(null);
  const [time, setTime] = useState({});
  const appOptions = useSelector(_appOptions);

  useEffect(() => {
    const arr = findNewCompetitions(competitions);
    if (limit && arr) {
      const temp = arr.slice(0, limit);
      setFilteredCompetitions(temp);
      return;
    }
    setFilteredCompetitions(arr);
  }, [competitions]);

  useEffect(() => {
    // const c = competitions?.find((el) => Number(el.ID) === Number(featuredID));
    const c = dispatch(getCompetitionById(featuredID));
    setFeaturedComp(c);
  }, [competitions, featuredID]);

  const changeStateTime = () => {
    if (featuredComp?.end_time) {
      const data = countdown(featuredComp.end_time);
      setTime({ ...data });
    }
  };

  useEffect(() => {
    const id = appOptions?.most_featured_competition_id;
    if (id) setFeaturedID(Number(id));
  }, [appOptions]);

  useEffect(() => {
    changeStateTime();
    const interval = setInterval(() => {
      changeStateTime();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [featuredComp]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <section className="container pt-5 mt-3 mt-md-0 pt-md-6 pt-lg-7">
        <div className="row">
          <div className="col-lg-4 d-none d-lg-block">
            <div className="card h-100 p-4">
              <div className="p-2">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-1">
                  <h3 className="font-size-xl mb-0">New competitions</h3>
                  <Link
                    className="font-size-sm font-weight-medium mr-n2"
                    to="/running-competitions"
                  >
                    View more
                    <i className="fe-chevron-right font-size-lg ml-1"></i>
                  </Link>
                </div>

                {filteredCompetitions?.map((c, i) => {
                  const price = c?.price;
                  const reducedPrice = c?.reduced_price;
                  return (
                    <div
                      className="media align-items-center pb-2 mb-1"
                      key={"new-arrival-comp" + i}
                    >
                      <Link
                        className="d-block"
                        to={`/competition/${c.ID}`}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <img
                          className="rounded"
                          width="60"
                          src={c.featured_image}
                          alt="Product"
                        />
                      </Link>
                      <div className="media-body pl-2 ml-1">
                        <h4 className="font-size-md nav-heading mb-1">
                          <Link
                            className="font-weight-medium"
                            to={`/competition/${c.ID}`}
                            onClick={() => {
                              window.scrollTo(0, 0);
                            }}
                          >
                            {c.title}
                          </Link>
                        </h4>
                        <p className="font-size-sm mb-0">
                          {reducedPrice ? (
                            <del className="font-size-sm text-muted mr-1">
                              £{price}
                            </del>
                          ) : (
                            <></>
                          )}
                          <span className="text-heading font-weight-semibold">
                            £{reducedPrice ? reducedPrice : price}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="bg-secondary rounded-lg pt-5 px-3 pl-sm-5 pr-sm-2">
              <div className="text-center text-sm-left pl-2 row mr-0">
                <div className="pb-5 col-lg-5">
                  <h2 className="h1">{featuredComp?.title}</h2>
                  <p
                    className="pb-2 mx-auto mx-sm-0"
                    style={{ maxWidth: "14rem" }}
                  >
                    Entries discounted to{" "}
                    {featuredComp?.reduced_price ? (
                      <del className="font-size-sm text-muted mr-1">
                        £{featuredComp?.price}
                      </del>
                    ) : (
                      <></>
                    )}{" "}
                    <span className="text-heading font-weight-semibold">
                      £
                      {featuredComp?.reduced_price
                        ? featuredComp?.reduced_price
                        : featuredComp?.price}
                    </span>
                    !
                  </p>
                  <div className="d-inline-block bg-faded-danger text-danger font-size-sm font-weight-medium rounded-sm px-3 py-2">
                    Limited time offer
                  </div>
                  <div
                    className="cs-countdown pt-3 h4 justify-content-center justify-content-sm-start"
                    data-countdown="12/25/2020 00:00:00 AM"
                  >
                    <div className="cs-countdown-days">
                      <span className="cs-countdown-value">
                        {time?.days || 0}
                      </span>
                      <span className="cs-countdown-label font-size-xs text-muted">
                        Days
                      </span>
                    </div>
                    <div className="cs-countdown-hours">
                      <span className="cs-countdown-value">
                        {time?.hours || 0}
                      </span>
                      <span className="cs-countdown-label font-size-xs text-muted">
                        Hours
                      </span>
                    </div>
                    <div className="cs-countdown-minutes">
                      <span className="cs-countdown-value">
                        {time?.minutes || 0}
                      </span>
                      <span className="cs-countdown-label font-size-xs text-muted">
                        Mins
                      </span>
                    </div>
                  </div>
                  <Link
                    className="btn btn-primary"
                    to={`competition/${featuredComp?.ID}`}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    Get yours now!
                  </Link>
                </div>
                <div className="col-lg-7 pb-5">
                  <img
                    src={featuredComp?.featured_image}
                    alt="Promo banner"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
