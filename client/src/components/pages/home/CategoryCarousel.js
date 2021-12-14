import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { _categories } from "../../../app/competition/categorySlice";
import { Link } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import { useMediaQuery } from "react-responsive";

export default function CategoryCarousel() {
  const categories = useSelector(_categories);
  const sliderRef = useRef();
  const isDesktop = useMediaQuery({
    minWidth: 800,
  });

  useEffect(() => {}, [sliderRef]);

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 600, itemsToShow: 2 },
    { width: 850, itemsToShow: 3 },
    // { width: 1200, itemsToShow: 2 },
  ];

  // const cats = categories?.slice(0, 4);

  return (
    <>
      <section
        className="container bg-overlay-content"
        // style={{ marginTop: "-290px" }}
        style={{}}
      >
        <div
          className="cs-carousel"
          id="categories-box-homepage"
          style={{ width: isDesktop ? "100%" : "90%" }}
        >
          {categories && categories.length && (
            <Carousel
              // style={{ maxWidth: "100%", width: "100%" }}
              breakPoints={breakPoints}
              pagination={false}
              showArrows={isDesktop ? true : false}
              // itemsToShow={isDesktop ? 3 : 1}
            >
              {categories?.map((cat, i) => {
                return (
                  <div
                    key={"category-" + i}
                    className="pb-2 pl-3 pr-3 ml-3 mr-3"
                    //  style={{ width: "100%", height: "20rem" }}
                  >
                    <Link
                      className="card card-category box-shadow"
                      to={`/category/${cat.ID}`}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      <span
                        className="badge badge-lg badge-floating badge-floating-right badge-success"
                        style={{
                          width: isDesktop ? "" : "37%",
                          fontSize: isDesktop ? "1rem" : "0.65rem",
                        }}
                      >
                        From £1.97
                      </span>
                      <img
                        className="card-img-top w-100"
                        src={cat.image}
                        style={{
                          height: isDesktop ? "15rem" : "13rem",
                          minWidth: isDesktop ? "17.62rem" : "13rem",
                        }}
                        alt="Running Competitions"
                      />
                      <div className="card-body">
                        <h4 className="card-title">{cat.name}</h4>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          )}
        </div>
      </section>
    </>
  );
}
