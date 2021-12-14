// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";

import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Lightbox from "react-awesome-lightbox";
import {
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";

import { formatDateToShow } from "../../../app/helpers/utils";

import { _appOptions } from "../../../app/appState/appSlice";
import { _competitions } from "../../../app/competition/competitionSlice";
import { UpdateRewardPointsToUserAccount, _profile } from "../../../app/user/userSlice";

import useAllFetched from "../../hooks/useAllFetched.jsx";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";

import Empty from "../layout/Empty.jsx";
import Loading from "../layout/Loading";

import PreviousWinnersCarousel from "./PreviousWinnersCarousel";

export default function PagePreviousWinner() {
  const { competitionID } = useParams();
  const appOptions = useSelector(_appOptions);
  const competitions = useSelector(_competitions);
  const profile = useSelector(_profile);
  const [comp, setComp] = useState({});
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const [shareUrl, setShareUrl] = useState("");
  const [host, setHost] = useState("");
  const wait = useWaitCompsAndCats();
  const allFetched = useAllFetched();
  const dispatch = useDispatch();

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  useEffect(() => {
    setShareUrl(window.location.href);
    setHost(window.location.origin);
  }, [location.pathname]);
  useEffect(() => {
    if (competitions) {
      const c = competitions.find((comp) => comp.ID === Number(competitionID));
      setComp(c);
    }
  }, [competitions, competitionID]);

  const winningTime = comp?.end_time ? formatDateToShow(comp?.end_time) : " ";

  if (allFetched && !wait && !comp?.ID) {
    return (
      <Empty
        message={`Sorry there is no such a competition or previous winner`}
        link={`/previous-winners`}
        linkText={`check previous winners page`}
      />
    );
  }

  const handleSharePressed = () => {
    if (!profile) return;
    let newRewards = 5;
    if (+appOptions['reward_points_per_social_share']) {
      newRewards = +appOptions['reward_points_per_social_share'];
    }
    dispatch(UpdateRewardPointsToUserAccount(profile.reward_points + newRewards));
  }

  return (
    <>
      {show && (
        <Lightbox
          images={comp?.images || []}
          startIndex={selectedImage}
          onClose={handleModalClose}
        />
      )}
      {wait ? (
        <Loading />
      ) : (
        <section className="cs-sidebar-enabled cs-sidebar-right">
          <div className="container">
            <div className="row">
              {/* <!-- Winner description--> */}
              <div className="col-lg-4 cs-sidebar pt-5 pt-lg-7 order-lg-2">
                <div className="px-sm-4 pt-6 py-lg-6">
                  <h1 className="h2">{comp?.title}</h1>
                  <div className="d-sm-flex alitgn-itams-center pt-3 pb-2 mb-5 border-bottom font-size-sm">
                    <div className="d-flex align-items-center mb-3">
                      <div className="text-nowrap text-muted mr-3">
                        <i className="fe-calendar mr-1"></i>
                        <span>{winningTime}</span>
                      </div>
                      <div className="text-nowrap text-muted">
                        <i className="fe-tag mr-1"></i>
                        <span>{comp?.category?.name}</span>
                      </div>
                    </div>
                    <a
                      className="btn btn-translucent-primary btn-sm ml-auto mb-3 d-inline-block d-lg-none"
                      href="#gallery"
                      data-scroll
                    >
                      Project Gallery
                    </a>
                  </div>
                  <h3 className="h5">Winner</h3>
                  <ul className="list-unstyled font-size-md mb-4 pb-2">
                    <li className="mb-2">
                      Name:
                      <span className="font-weight-medium text-nav ml-2">
                        {comp?.winner?.first_name +
                          " " +
                          comp?.winner?.last_name}
                      </span>
                    </li>
                    <li className="mb-2">
                      Ticket No:
                      <span className="font-weight-medium text-nav ml-2">
                        {comp?.winner_ticket_number}
                      </span>
                    </li>
                    <li>
                      No. of entries:
                      <span className="font-weight-medium text-nav ml-2">
                        {comp?.winner_number_of_entries}
                      </span>
                    </li>
                  </ul>
                  <h3 className="h5">Description</h3>
                  <p className="font-size-sm mb-4 pb-2">
                    {comp?.winner?.first_name + " " + comp?.winner?.last_name}{" "}
                    won a brand new {comp?.title}! They only had {" "}
                   {comp?.winner_number_of_entries} tickets, and won with ticket{" "}
                    {comp?.winner_ticket_number}. This Competition was very
                    popular. It becomes our {comp?.ID}th Template Competition
                    drawn.
                  </p>
                  <h3 className="h5">Final Notes</h3>
                  <p className="font-size-sm mb-2">
                    We only update our previous winner pages with the winners
                    once the draw has been confirmed.
                  </p>
                  <p className="font-size-sm mb-4 pb-2">
                    Please see our T&amp;C's for our draw requirements. Keep
                    your eyes on our social media for similar competitions!
                  </p>
                  <h3 className="h5">Share</h3>
                  {/* <div
                    className="fb-share-button"
                    dataHref="https://www.your-domain.com/your-page.html"
                    dataLayout="button_count"
                  ></div> */}

                  <FacebookShareButton
                    url={shareUrl}
                    className="social-btn sb-outline sb-facebook mr-2 my-2"
                    onClick={() => handleSharePressed()}
                  >
                    <i className="fe-facebook"></i>
                  </FacebookShareButton>
                  <TwitterShareButton
                    className="social-btn sb-outline sb-twitter mr-2 my-2"
                    url={shareUrl}
                    onClick={() => handleSharePressed()}
                  >
                    <i className="fe-twitter"></i>
                  </TwitterShareButton>
                  {/* <a className="social-btn sb-outline sb-google mr-2 my-2">
                    <i className="fe-google"></i>
                  </a> */}
                </div>
              </div>
              {/* <!-- Winner gallery (List)--> */}
              <div
                className="col-lg-8 cs-content pt-2 pt-lg-7 pb-lg-4 order-lg-1"
                id="gallery"
              >
                <div className="cs-gallery pt-5 pb-4 py-lg-5">
                  {comp?.images?.map((image, i) => {
                    if (i >= 4) return;
                    return (
                      <React.Fragment key={"image-thumb" + i}>
                        <div
                          className="cs-gallery-item rounded-lg mb-grid-gutter"
                          onClick={() => {
                            setSelectedImage(i);
                            handleModalShow();
                          }}
                        >
                          <img src={image} alt="Gallery thumbnail" />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* <!-- More Previous Winners (Carousel)--> */}
      {comp?.ID ? (
        <PreviousWinnersCarousel
          numberOfItems={4}
          competitionID={competitionID}
        />
      ) : (
        <></>
      )}
    </>
  );
}
