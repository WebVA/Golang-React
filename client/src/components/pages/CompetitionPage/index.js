/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { _competitions } from "../../../app/competition/competitionSlice";
import {
  getAllTicketsFromServer,
  _tickets,
  _ticketsCountState,
} from "../../../app/ticket/ticketSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import endpoints from "../../../app/constants/endpoints";
import QuizForm from "./QuizForm";
import Loading from "../layout/Loading";
import Empty from "../layout/Empty.jsx";
import YouMightLikeCarousel from "./YouMightLikeCarousel";
import { formatDateToShow } from "../../../app/helpers/utils";
import useAllFetched from "../../hooks/useAllFetched.jsx";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";

export default function CompetitionPage() {
  const competitions = useSelector(_competitions);
  const { id } = useParams();
  const [comp, setComp] = useState({});
  const dispatch = useDispatch();
  const tickets = useSelector(_tickets);
  const { soldTickets } = useSelector(_ticketsCountState);
  const [selectedImage, setSelectedImage] = useState(null);
  const wait = useWaitCompsAndCats();
  const allFetched = useAllFetched();

  useEffect(() => {
    if (competitions) {
      const c = competitions.find((comp) => comp?.ID === Number(id));
      setComp(c);
    }
  }, [competitions, id]);

  useEffect(() => {
    // if (!selectedImage) {
    if (comp?.featured_image) {
      setSelectedImage(comp?.featured_image);
    }
    // }
  }, [comp]);

  useEffect(() => {
    (async () => {
      await dispatch(getAllTicketsFromServer(id));
    })();
  }, [id]);

  if (allFetched && !wait && !comp?.ID) {
    return <Empty />;
  }

  const dateString = formatDateToShow(comp?.end_time);

  return (
    <>
      {/* {comp && JSON.stringify(comp, 4, 4)} */}
      {wait ? (
        <Loading />
      ) : (
        <>
          <section className="cs-sidebar-enabled cs-sidebar-right border-bottom mb-5 mb-md-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 cs-content py-4">
                  <nav aria-label="breadcrumb">
                    <ol className="py-1 my-2 breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/running-competitions">
                          Running Competitions
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {comp?.title}
                      </li>
                    </ol>
                  </nav>
                  <h1 className="mb-3 pb-4">{comp?.title}</h1>
                  {/* <!-- Product gallery--> */}
                  <div className="cs-product-gallery">
                    <div className="cs-preview order-sm-2">
                      <div>
                        <div
                          className="cs-preview-item active"
                          // id={comp?.featured_image}
                        >
                          <img
                            src={
                              selectedImage
                                ? selectedImage
                                : "/" + endpoints.defaultImage
                            }
                            alt="Product preview"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="cs-thumblist order-sm-1"
                      style={{ zIndex: 2 }}
                    >
                      {comp?.images?.map((image, i) => {
                        if (i > 3) return null;
                        let imgID;
                        switch (i) {
                          case 0:
                            imgID = "first";
                            break;
                          case 1:
                            imgID = "second";
                            break;
                          case 2:
                            imgID = "third";
                            break;
                          case 3:
                            imgID = "fourth";
                            break;
                          default:
                            imgID = "first";
                        }
                        return (
                          <div
                            className="hand-over"
                            key={"image-preview" + imgID}
                          >
                            <div
                              className={`cs-thumblist-item hand-over 
                            ${selectedImage === image ? "active" : ""} `}
                              onClick={(e) => {
                                setSelectedImage(image);
                              }}
                            >
                              <img
                                src={image}
                                className="hand-over"
                                alt="Product thumb"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* <!-- Product info--> */}
                <div className="col-lg-4 cs-sidebar bg-secondary pt-5 pl-lg-4 pb-md-2">
                  <div className="pl-lg-4 pb-5">
                    <div className="py-4">
                      {comp?.reduced_price ? (
                        <>
                          <del className="text-muted mr-2">£{comp?.price}</del>
                          <span className="h4 mb-0">
                            £{comp?.reduced_price}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="h4 mb-0">£{comp?.price}</span>
                        </>
                      )}
                    </div>
                    {comp?.winner?.ID ? (
                      <div className="font-size-sm pb-1 mb-2">
                        <h6 className="text-nowrap my-2 mr-3">
                          This competition has ended, check the winner.
                        </h6>
                      </div>
                    ) : (
                      <>
                      {soldTickets !== null && tickets?.length && (
                        <div className="pb-3 mb-5 pt-3">
                          <div className="text-center pb-3">
                            <h3>Tickets Sold: {soldTickets ? soldTickets : 0}</h3>
                          </div>
                          <div className="align-items-center">
                            <div className="w-100">
                              <div className="progress">
                                <div
                                  className="progress-bar font-weight-medium"
                                  role="progressbar"
                                  style={{
                                    width: `${Math.round(
                                      (soldTickets / tickets.length) * 100
                                    )}%`,
                                  }}
                                  aria-valuenow={
                                    soldTickets !== null ? soldTickets : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={tickets?.length}
                                >
                                  {Math.round((soldTickets / tickets.length) * 100)}%
                                </div>
                              </div>
                              <div className="progress-start font-size-sm float-left mt-1">
                                {0}
                              </div>
                              <div className="progress-end font-size-sm float-right mt-1">
                                {tickets.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {
                        soldTickets !== null && tickets?.length && comp.tickets_for_early_draw && (comp.tickets_for_early_draw - soldTickets > 0) && (
                          <h4 className="text-nowrap my-2 mr-3 pb-1 mb-2">
                            Tickets left until early draw: {comp.tickets_for_early_draw - soldTickets}!
                          </h4>
                      )}
                      <div className="font-size-sm pb-1 mb-2">
                        <span className="font-weight-medium text-heading mb-0">
                          Please answer the following question:
                        </span>
                        <h6 className="text-nowrap my-2 mr-3">
                          {comp?.quiz?.question}
                        </h6>
                      </div>
                      </>
                    )}
                    {/* Quiz Form, all its action contained in this component */}
                    <div className="mr-lg-n2">
                      <QuizForm comp={comp || null} />
                    </div>

                    {comp?.winner?.ID ? (
                      <></>
                    ) : (
                      <>
                        <p className="font-size-sm mb-2">
                          We are giving you the opportunity to win this{" "}
                          {comp?.title} for just £
                          {comp?.reduced_price || comp?.price}!
                          <br />
                          More information about this draw can been seen below.
                        </p>
                        <a
                          className="cs-fancy-link font-size-sm"
                          href="#more-info"
                          data-scroll
                        >
                          Read more
                        </a>
                      </>
                    )}
                    <hr className="my-4" />
                    <ul className="list-unstyled font-size-sm">
                      <li>
                        <span className="text-heading font-weight-medium mr-2">
                          Live draw:
                        </span>
                        {dateString}
                      </li>
                      <li>
                        <span className="text-heading font-weight-medium mr-2">
                          Max tickets per person:
                        </span>
                        {comp?.max_tickets_per_person}
                      </li>
                      <li>
                        <span className="text-heading font-weight-medium mr-2">
                          CompID:
                        </span>
                        CP{comp?.ID}
                      </li>
                      <li>
                        <span className="text-heading font-weight-medium mr-2">
                          Category:
                        </span>
                        <Link
                          to={`/category/${comp?.category?.ID}`}
                          className="text-body text-decoration-none"
                        >
                          {comp?.category?.name}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* end of product section */}
          {/* <!-- Product description--> */}
          {comp?.winner?.ID ? (
            <></>
          ) : (
            <section
              className="mt-1 pt-3 pt-md-0 pb-md-2 border-bottom"
              id="more-info"
            >
              <div className="container">

                <div className="pb-3 mb-2">
                  <div className="text-center">
                    <h2 className="mb-4">Win {comp?.title}!</h2>
                    <p className="font-size-sm">{comp?.headline}</p>
                    <h4>
                      Entries discounted to{" "}
                      <span className="text-primary">
                        £{comp?.reduced_price || comp?.price}!
                      </span>
                    </h4>
                    <h5>
                      Max entries:{" "}
                      <span className="text-primary">
                        {comp?.number_of_tickets}!
                      </span>
                    </h5>
                    <h5 className="pb-2">
                      Max per person:{" "}
                      <span className="text-primary">
                        {comp?.max_tickets_per_person}!
                      </span>
                    </h5>
                    <p className="font-size-sm">
                      ​The draw for this competition will take place live on
                      <span className="text-primary"> {dateString}</span>. If
                      all entries are sold before the end date this date will
                      move forward. To keep updated on the confirmed date
                      subscribe to our newsletter.
                    </p>
                    <p className="font-size-sm">
                      ​We will contact the winner after the live draw has
                      finished and arrange delivery if required.
                    </p>
                    <p className="font-size-sm">
                      ​Your ticket numbers will be emailed to you upon
                      completion of your order.
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-center">
                    {/* <h3 className="mb-4">{comp?.title}</h3> */}
                    <h5 className="mb-4">Product Description/Features:</h5>
                    <p className="font-size-sm">{comp?.description}</p>
                    {/* <SanitizedHTML html={comp?.features} /> */}
                    <div dangerouslySetInnerHTML={{ __html: comp?.features }} />
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
      {/* cause it calling set competitions twice (if not fetched), let's wait the comp */}
      {/* {comp && <TrendingCompetitions />}
      <br />
       <br /> <br /> <br /> <br /> <br /> */}
      {/* <YouMightLike /> */}
      <section className="container">
        {comp?.ID && (
          <>
            <h2 className="text-center mb-5 mt-4">You might like</h2>
            <YouMightLikeCarousel categoryID={comp?.category?.ID} compID={id} />
          </>
        )}
      </section>
    </>
  );
}
