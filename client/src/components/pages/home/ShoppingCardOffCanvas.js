import React from 'react'

export default function ShoppingCardOffCanvas() {
    return (
        <>
            {/* <!-- Shopping cart off-canvas--> */}
    <div className="cs-offcanvas cs-offcanvas-collapse-always cs-offcanvas-right" id="shoppingCart">
      <div className="cs-offcanvas-cap navbar-box-shadow px-4 mb-2">
        <h5 className="mt-1 mb-0">Your cart</h5>
        <button className="close lead" type="button" data-toggle="offcanvas" data-offcanvas-id="shoppingCart"><span aria-hidden="true">&times;</span></button>
      </div>
      <div className="cs-offcanvas-body p-4" data-simplebar>
        <div className="media align-items-center mb-3"><a className="d-block" href="https://www.comp-performance.co.uk/product/competition-item-template"><img className="rounded" width="60" src="img/demo/shop-homepage/thumbnails/05.jpg" alt="Product"/></a>
          <div className="media-body pl-2 ml-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mr-3">
                <h4 className="nav-heading font-size-md mb-1"><a className="font-weight-medium" href="https://www.comp-performance.co.uk/product/competition-item-template">Smart Watch Series 5</a></h4>
                <div className="d-flex align-items-center font-size-sm"><span className="mr-2">£364.99</span><span className="mr-2">x</span>
                  <input className="form-control form-control-sm px-2" type="number" style={{maxWidth: "3.5rem"}} defaultValue="1" readOnly />
                </div>
              </div>
              <div className="pl-3 border-left"><a className="d-block text-danger text-decoration-none font-size-xl" href="#" data-toggle="tooltip" title="Remove"><i className="fe-x-circle"></i></a></div>
            </div>
          </div>
        </div>
        <div className="media align-items-center mb-3"><a className="d-block" href="https://www.comp-performance.co.uk/product/competition-item-template"><img className="rounded" width="60" src="img/demo/shop-homepage/thumbnails/02.jpg" alt="Product"/></a>
          <div className="media-body pl-2 ml-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mr-3">
                <h4 className="nav-heading font-size-md mb-1"><a className="font-weight-medium" href="https://www.comp-performance.co.uk/product/competition-item-template">Running Sneakers, Collection</a></h4>
                <div className="d-flex align-items-center font-size-sm"><span className="mr-2">£145.00</span><span className="mr-2">x</span>
                  <input className="form-control form-control-sm px-2" type="number" style={{maxWidth: "3.5rem"}} defaultValue="1" readOnly />
                </div>
              </div>
              <div className="pl-3 border-left"><a className="d-block text-danger text-decoration-none font-size-xl" href="#" data-toggle="tooltip" title="Remove"><i className="fe-x-circle"></i></a></div>
            </div>
          </div>
        </div>
        <div className="media align-items-center mb-3"><a className="d-block" href="https://www.comp-performance.co.uk/product/competition-item-template"><img className="rounded" width="60" src="img/demo/shop-homepage/thumbnails/06.jpg" alt="Product"/></a>
          <div className="media-body pl-2 ml-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mr-3">
                <h4 className="nav-heading font-size-md mb-1"><a className="font-weight-medium" href="https://www.comp-performance.co.uk/product/competition-item-template">Wireless Bluetooth Headset</a></h4>
                <div className="d-flex align-items-center font-size-sm"><span className="mr-2">£258.00</span><span className="mr-2">x</span>
                  <input className="form-control form-control-sm px-2" type="number" style={{maxWidth: "3.5rem"}} defaultValue="1" readOnly />
                </div>
              </div>
              <div className="pl-3 border-left"><a className="d-block text-danger text-decoration-none font-size-xl" href="#" data-toggle="tooltip" title="Remove"><i className="fe-x-circle"></i></a></div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs-offcanvas-cap d-block border-top px-4 mb-2">
        <div className="d-flex justify-content-between mb-4"><span>Total:</span><span className="h6 mb-0">£776.99</span></div><a className="btn btn-primary btn-sm btn-block" href="https://www.comp-performance.co.uk/checkout"><i className="fe-credit-card font-size-base mr-2"></i>Checkout</a>
      </div>
    </div>
            
        </>
    )
}
