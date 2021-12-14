import React from 'react'

export default function Features() {
    return (
      <>
        <section className="container py-5 pt-md-3 pt-lg-7">
          <div className="text-center mb-5 pt-3 pt-lg-4">
            <h2 className="h1">
              Why{" "}
              <span className="bg-faded-primary rounded text-primary px-3 py-2">
                Comp Performance?
              </span>
            </h2>
          </div>
          <div className="row pt-3 pt-lg-4">
            <div className="col-md-6">
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">Fixed draw dates</h3>
                  <p className="font-size-md mb-0">
                    Our draw dates are guaranteed when the competition is
                    launched and won't be extended!
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">Transparent running</h3>
                  <p className="font-size-md mb-0">
                    All of our competition draws will be live and available for
                    you to watch on our socials. We also show all of our reviews
                    good or bad on our site, and so you have piece of mind. A
                    continuing growing list of previous winners!
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">Professionally built website</h3>
                  <p className="font-size-md mb-0">
                    We've built this site from the ground up with competitions
                    in mind, this allows for a seemingly simple user experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">Fast and robust ordering</h3>
                  <p className="font-size-md mb-0">
                    Our state of the art website allows you to receive your
                    ticket numbers as soon as we have proceeded your order!
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">100% Safe</h3>
                  <p className="font-size-md mb-0">
                    Our site uses SSL encryption letting you know all payments
                    are handled correctly and kept safe.
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4 pb-2">
                <i className="fe-check-circle h4 text-success"></i>
                <div className="pl-3">
                  <h3 className="h5">Repeat User Rewards</h3>
                  <p className="font-size-md mb-0">
                    For our loyal customers, we want to give back. That's why we
                    have a running rewards program which you can see on the
                    rewards page!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
