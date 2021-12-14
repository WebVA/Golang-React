import React from "react";

export default function YouMightLike() {
  return (
    <>
      <section className="container pt-3 pb-5 mb-3 mb-sm-0 pt-sm-0 pb-sm-6">
        <h2 className="h3 text-center mb-5">You may also like</h2>
        <div className="cs-carousel">
          <div
            className="cs-carousel-inner"
            data-carousel-options='{"items": 2, "controls": false, "nav": true, "responsive": {"0":{"items":1, "gutter": 16},"500":{"items":2, "gutter": 16}, "780":{"items":3, "gutter": 16}, "1000":{"items":4, "gutter": 23}}}'
          >
            <div className="pb-2">
              <div className="card card-product card-hover mx-1">
                <a className="card-img-top" href="#">
                  <img
                    src="../../img/shop/catalog/13.jpg"
                    alt="Product thumbnail"
                  />
                </a>
                <div className="card-body">
                  <a className="meta-link font-size-xs mb-1" href="#">
                    Men's shoes
                  </a>
                  <h3 className="font-size-md font-weight-medium mb-2">
                    <a className="meta-link" href="#">
                      Sport Running Sneakers
                    </a>
                  </h3>
                  <span className="text-heading font-weight-semibold">£154.00</span>
                </div>
              </div>
            </div>

            <div className="pb-2">
              <div className="card card-product card-hover mx-1">
                <span className="badge badge-floating badge-pill badge-danger">
                  Sale
                </span>
                <a className="card-img-top" href="#">
                  <img
                    src="../../img/shop/catalog/14.jpg"
                    alt="Product thumbnail"
                  />
                </a>
                <div className="card-body">
                  <a className="meta-link font-size-xs mb-1" href="#">
                    Men's shoes
                  </a>
                  <h3 className="font-size-md font-weight-medium mb-2">
                    <a className="meta-link" href="#">
                      Sport Running Sneakers
                    </a>
                  </h3>
                  <del className="font-size-sm text-muted mr-1">£130.00</del>
                  <span className="text-heading font-weight-semibold">£98.00</span>
                </div>
              </div>
            </div>

            <div className="pb-2">
              <div className="card card-product card-hover mx-1">
                <a className="card-img-top" href="#">
                  <img
                    src="../../img/shop/catalog/15.jpg"
                    alt="Product thumbnail"
                  />
                </a>
                <div className="card-body">
                  <a className="meta-link font-size-xs mb-1" href="#">
                    Men's shoes
                  </a>
                  <h3 className="font-size-md font-weight-medium mb-2">
                    <a className="meta-link" href="#">
                      Sport Running Sneakers
                    </a>
                  </h3>
                  <span className="text-heading font-weight-semibold">£127.00</span>
                </div>
              </div>
            </div>

            <div className="pb-2">
              <div className="card card-product card-hover mx-1">
                <a className="card-img-top" href="#">
                  <img
                    src="../../img/shop/catalog/16.jpg"
                    alt="Product thumbnail"
                  />
                </a>
                <div className="card-body">
                  <a className="meta-link font-size-xs mb-1" href="#">
                    Men's shoes
                  </a>
                  <h3 className="font-size-md font-weight-medium mb-2">
                    <a className="meta-link" href="#">
                      Sport Running Sneakers
                    </a>
                  </h3>
                  <span className="text-heading font-weight-semibold">£135.00</span>
                </div>
              </div>
            </div>

            <div className="pb-2">
              <div className="card card-product card-hover mx-1">
                <span className="badge badge-floating badge-pill badge-danger">
                  Sale
                </span>
                <a className="card-img-top" href="#">
                  <img
                    src="../../img/shop/catalog/17.jpg"
                    alt="Product thumbnail"
                  />
                </a>
                <div className="card-body">
                  <a className="meta-link font-size-xs mb-1" href="#">
                    Men's shoes
                  </a>
                  <h3 className="font-size-md font-weight-medium mb-2">
                    <a className="meta-link" href="#">
                      Sport Running Sneakers
                    </a>
                  </h3>
                  <del className="font-size-sm text-muted mr-1">£4.99</del>
                  <span className="text-heading font-weight-semibold">£1.97</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
