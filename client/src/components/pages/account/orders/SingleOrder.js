import React from "react";
import { formatDateToShow } from "../../../../app/helpers/utils";
import {
  calculateOrderSubTotal,
  calculateOrderTotal,
  calculateOrderSubQuantity,
  calculateOrderTicketsNumbers,
  calculateOrderNumberOfCompetitions,
  prepareOrderItemsForShow,
} from "../../../../app/helpers/order-helpers";
import {
  prepareCompetitionImagesUrlsArray,
} from "../../../../app/constants/endpoints";
import { _competitions } from "../../../../app/competition/competitionSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { displayPrice } from '../../../../app/helpers/utils'

export default function SingleOrder({ order }) {
  const itemsToShow = prepareOrderItemsForShow(order);
  const competitions = useSelector(_competitions);

  return (
    <>
      {/* <!-- Order expanded--> */}
      <div className="card">
        <div className="card-header">
          <div className="accordion-heading">
            <a
              className="collapsed d-flex flex-wrap align-items-center justify-content-between pr-4"
              href={`#order-${order?.ID}`}
              role="button"
              data-toggle="collapse"
              aria-expanded="true"
              aria-controls={`order-${order?.ID}`}
            >
              <div className="font-size-sm font-weight-medium text-nowrap my-1 mr-2">
                <i className="fe-hash font-size-base mr-1"></i>
                <span className="d-inline-block align-middle">
                  {order?.ID}
                </span>
              </div>
              <div className="text-nowrap text-body font-size-sm font-weight-normal my-1 mr-2">
                <i className="fe-clock text-muted mr-1"></i>
                {formatDateToShow(order?.CreatedAt || 0)}
              </div>
              <div className="bg-faded-info text-info font-size-xs font-weight-medium py-1 px-3 rounded-sm my-1 mr-2">
                {order?.order_status?.status}
              </div>
              <div className="text-body font-size-sm font-weight-medium my-1">
                {displayPrice(order?.total)}
              </div>
            </a>
          </div>
        </div>
        <div
          className="collapse"
          id={`order-${order?.ID}`}
          data-parent="#orders-accordion"
        >
          <div className="card-body pt-4 border-top bg-secondary">
            {itemsToShow?.map((item, i) => {
              const ticks = calculateOrderTicketsNumbers(
                order,
                item?.competition_id
              );
              const tickString = ticks.join(", ");

              let images;

              const imgComp = competitions.find(
                (c) => c.ID === item?.competition?.ID
              );

              if (imgComp?.images) {
                images = imgComp.images;
              } else {
                images = prepareCompetitionImagesUrlsArray(item?.competition);
              }

              return (
                <React.Fragment key={"single-order-item" + i}>
                  {/* <!-- Item--> */}
                  <div className="d-sm-flex justify-content-between mb-3 pb-1">
                    <div className="order-item media media-ie-fix d-block d-sm-flex mr-sm-3">
                      <a className="d-table mx-auto" href="#">
                        <img
                          className="d-block rounded"
                          width="105"
                          src={images[0]}
                          alt="Order"
                        />
                      </a>
                      <div className="media-body font-size-sm pt-2 pl-sm-3 text-center text-sm-left">
                        <h5 className="nav-heading font-size-sm mb-2">
                          <Link to={`/competition/${item?.competition?.ID}`}>{item?.competition?.title}</Link>
                        </h5>
                        <div>
                          <span className="text-muted mr-1">Comp ID:</span>
                          CP{item?.competition?.ID}
                        </div>
                        <div>
                          <span className="text-muted mr-1">Draw Date:</span>
                          {formatDateToShow(item?.competition?.end_time || 0)}
                        </div>
                        <div>
                          <span className="text-muted mr-1">Given Answer:</span>
                          {item?.given_answer_string || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="font-size-sm text-center pt-2 mr-sm-3">
                      <div className="text-muted">Quantity:</div>
                      <div className="font-weight-medium">
                        {calculateOrderSubQuantity(order, item?.competition_id)}
                      </div>
                    </div>
                    <div className="font-size-sm text-center pt-2">
                      <div className="text-muted">Subtotal:</div>
                      <div className="font-weight-medium">
                        {
                          [1].map(n => {
                            const subtotal = calculateOrderSubTotal(order, item?.competition_id)
                            return <>{displayPrice(subtotal)}</>
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary font-size-sm mb-3 pb-1"
                    data-toggle="collapse"
                    data-target={`#collapseTicketsComp${item.competition_id}`}
                    aria-expanded="false"
                    aria-controls={`collapseTicketsComp${item.competition_id}`}
                  >
                    Ticket Number(s)
                  </button>
                  <div
                    className="collapse mb-3 pb-1"
                    id={`collapseTicketsComp${item.competition_id}`}
                  >
                    <div className="card card-header font-size-sm pt-2">
                      {tickString}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 border-top">
              <div className="font-size-sm my-2 mr-2">
                <span className="text-muted mr-1">Number of Competitions:</span>
                <span className="font-weight-medium">
                  {calculateOrderNumberOfCompetitions(order)}
                </span>
              </div>
              <div className="font-size-sm my-2 mr-2">
                <span className="text-muted mr-1">Number of Tickets:</span>
                <span className="font-weight-medium">
                  {order?.order_items?.length}
                </span>
              </div>
              <div className="font-size-sm my-2 mr-2">
                <span className="text-muted mr-1">Total:</span>
                {
                  [1].map(n => {
                    const orderTotalByCalculation = calculateOrderTotal(order);
                    return (
                      <React.Fragment key={`order-total-${order?.ID}`}>
                        {Number(order.total) === Number(orderTotalByCalculation) ? <span className="font-weight-medium">{displayPrice(order.total)}</span> : <></>}
                        {Number(order.total) !== Number(orderTotalByCalculation) ? <>
                          <del className="font-weight-medium ml-2 mr-2">{displayPrice(orderTotalByCalculation)}</del>
                          <span className="font-weight-medium">{displayPrice(order.total)}</span>
                        </> : <></>}
                      </React.Fragment>
                    )
                  })
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
