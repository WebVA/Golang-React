import React from "react";
import PreviousWinnersCarousel from "../previous-winners/index.js";
import {Link} from "react-router-dom";

export default function AboutPage() {
  return (
    <>
      {/* <!-- Intro--> */}
      <section class="container my-lg-2 pt-5 pb-lg-7">
        <div class="row align-items-center">
          <div class="col-lg-5 py-3 py-lg-0">
            <h1>Our goals. Our mission.</h1>
            <h2 class="h3">How we help everyday people win big.</h2>
            <div class="py-4">
              <p class="cs-callout">
                We're tired of big prizes with even bigger odds and constantly
                extending entry dates. Our mission is to provide good
                competitions with incredible odds. Join our ever extending
                winners list!
              </p>
            </div>
          </div>
          <div class="col-xl-6 col-lg-7 offset-xl-1">
            <div class="py-5" style={{ minHeight: "543px" }}>
              <div
                class="d-none d-lg-block position-absolute bg-no-repeat bg-position-center h-100"
                style={{
                  top: 0,
                  left: "-45px",
                  width: "646px",
                  backgroundImage: "url(img/pages/about/bg-shape.svg)",
                }}
              ></div>
              <div class="row no-gutters mx-n2 pt-lg-4">
                <div class="col-sm-4 px-2 mb-3">
                  <a class="card h-100 card-body py-5 justify-content-center border-0 box-shadow-lg text-center">
                    <i class="fe-zap text-primary h1 mb-3"></i>
                    <h3 class="h5 mb-0">Exciting</h3>
                  </a>
                </div>
                <div class="col-sm-4 px-2 mb-3">
                  <a class="card card-body py-5 border-0 box-shadow-lg text-center mb-3">
                    <i class="fe-key text-danger h1 mb-3"></i>
                    <h3 class="h5 mb-0">Secure</h3>
                  </a>
                  <a class="card card-body py-5 border-0 box-shadow-lg text-center">
                    <i class="fe-refresh-ccw text-info h1 mb-3"></i>
                    <h3 class="h5 mb-0">Automatic</h3>
                  </a>
                </div>
                <div class="col-sm-4 px-2 mb-3">
                  <a class="card card-body py-5 border-0 box-shadow-lg text-center mb-3">
                    <i class="fe-pocket text-success h1 mb-3"></i>
                    <h3 class="h5 mb-0">Affordable</h3>
                  </a>
                  <a class="card card-body py-5 border-0 box-shadow-lg text-center">
                    <i class="fe-star-filled text-warning h1 mb-3"></i>
                    <h3 class="h5 mb-0">Legitimate</h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Statistics--> */}
      <section class="bg-secondary py-5 mt-n4 mb-6 mt-lg-0 mb-lg-7">
        <div class="container py-3">
          <div class="row">
            <div class="col-md-3 col-sm-6 text-center py-3">
              <h3 class="display-4">3</h3>
              <p class="text-muted mb-0">Winners</p>
            </div>
            <div class="col-md-3 col-sm-6 text-center py-3">
              <h3 class="display-4">£951.60</h3>
              <p class="text-muted mb-0">In prizes</p>
            </div>
            <div class="col-md-3 col-sm-6 text-center py-3">
              <h3 class="display-4">90%</h3>
              <p class="text-muted mb-0">Positive feedback</p>
            </div>
            <div class="col-md-3 col-sm-6 text-center py-3">
              <h3 class="display-4">497</h3>
              <p class="text-muted mb-0">Tickets sold</p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Previous winners--> */}
      {/* <section class="container pb-5">
        <PreviousWinnersCarousel numberOfItems={4} hideTop  hideLoadMore  />
        <div className="text-center py-3 pb-md-0">
          <Link
            to ="/previous-winners"
            className="btn btn-primary"
          >
            <i className="fe-refresh-ccw mr-2"></i>Load More Previous Winners
          </Link>
        </div>
      </section> */}
      {/* <!-- How to Play--> */}
      <section class="container pb-5 pb-lg-6">
        <div class="row justify-content-center mb-4 pb-2">
          <div class="col-xl-6 col-lg-7 col-md-8">
            <h2 class="h1 mb-4 text-center">
              How to{" "}
              <span class="bg-faded-primary rounded text-primary px-3 py-2">
                Play!
              </span>
            </h2>
            <p class="text-muted text-center">
              A few simple steps to help you get playing!
            </p>
          </div>
        </div>
        <div class="row justify-content-center mb-4 pb-2">
          <div class="col-lg-3">
            <ul
              class="nav nav-tabs cs-media-tabs justify-content-center justify-content-lg-start"
              role="tablist"
            >
              <li class="nav-item mb-3" style={{ width: "16.5rem" }}>
                <a
                  class="nav-link mr-2 active"
                  href="#account"
                  data-toggle="tab"
                  role="tab"
                >
                  <div class="media align-items-center">
                    <img
                      class="rounded"
                      width="60"
                      src="img/demo/presentation/icons/user.svg"
                      alt="User Account"
                    />
                    <div class="media-body pl-2 ml-1">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="font-size-sm pr-1">Creating An Account</div>
                        <i class="fe-chevron-right lead ml-2 mr-1"></i>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="nav-item mb-3" style={{ width: "16.5rem" }}>
                <a
                  class="nav-link mr-2"
                  href="#Competition"
                  data-toggle="tab"
                  role="tab"
                >
                  <div class="media align-items-center">
                    <img
                      class="rounded"
                      width="60"
                      src="img/demo/booking/icons/01.svg"
                      alt="Competition"
                    />
                    <div class="media-body pl-2 ml-1">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="font-size-sm pr-1">
                          Selecting A Competition
                        </div>
                        <i class="fe-chevron-right lead ml-2 mr-1"></i>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="nav-item mb-3" style={{ width: "16.5rem" }}>
                <a
                  class="nav-link mr-2"
                  href="#checkout"
                  data-toggle="tab"
                  role="tab"
                >
                  <div class="media align-items-center">
                    <img
                      class="rounded"
                      width="60"
                      src="img/demo/presentation/icons/shopping-cart.svg"
                      alt="Checkout"
                    />
                    <div class="media-body pl-2 ml-1">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="font-size-sm pr-1">Check-out</div>
                        <i class="fe-chevron-right lead ml-2 mr-1"></i>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="tab-content">
              <div class="tab-pane fade show active" id="account">
                <div class="row text-center text-sm-left">
                  <div class="mb-3 mb-sm-0">
                    <h3 class="h5 mb-4">Creating An Account!</h3>
                    <p>
                      To be able to enter our competitions you need to first
                      create an account. You will need to enter a valid email, name and password.
                    </p>
                    <p class="mb-0">
                      It takes less than a minute to complete the form!
                    </p>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="Competition">
                <div class="row text-center text-sm-left">
                  <div class="mb-3 mb-sm-0">
                    <h3 class="h5 mb-4">Selecting A Competition!</h3>
                    <p>
                      Once you have created an account, you can now enter any of
                      our active competitions! You will be able to see all the
                      active competitions via the "Running Competitions" tab.
                    </p>
                    <p class="mb-0">
                      Select a competition you wish to enter. It will show you
                      the price, current tickets bought, tickets left and max
                      tickets per person. Select the number of tickets you want
                      to buy and answer the corresponding question.
                    </p>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="checkout">
                <div class="row text-center text-sm-left">
                  <div class="mb-3 mb-sm-0">
                    <h3 class="h5 mb-4">Check Out!</h3>
                    <p>
                      You've selected a competition(s) which will show in the
                      basket, you will also be prompted with special offers or
                      addons to your basket.
                    </p>
                    <p class="mb-0">
                      Here you can apply discounts, change the quantity or head
                      straight to checkout. Checking out will lead to a secure
                      page to enter Billing details, payment details and agree
                      to our T&amp;Cs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Q&A--> */}
      <section
        class="position-relative bg-secondary py-5 py-md-6 py-lg-7"
        style={{ marginTop: "-75px" }}
      >
        <div style={{ height: "75px" }}></div>
        <div class="cs-shape cs-shape-top cs-shape-curve bg-body">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 185.4">
            <path
              fill="currentColor"
              d="M3000,185.4V0H0v185.4C496.4,69.8,996.4,12,1500,12S2503.6,69.8,3000,185.4z"
            ></path>
          </svg>
        </div>
        <div class="container mt-n4 py-3 py-md-2">
          <h2 class="text-center mb-5">Frequently Asked Questions</h2>
          <div class="row justify-content-center">
            <div class="col-lg-8 col-md-9">
              <div class="accordion accordion-alt" id="faq">
                <div class="card border-0 box-shadow card-active">
                  <div class="card-header">
                    <h3 class="accordion-heading">
                      <a
                        href="#faq-1"
                        role="button"
                        data-toggle="collapse"
                        aria-expanded="true"
                        aria-controls="faq-1"
                      >
                        How is a winner chosen?
                        <span class="accordion-indicator"></span>
                      </a>
                    </h3>
                  </div>
                  <div class="collapse show" id="faq-1" data-parent="#faq">
                    <div class="card-body font-size-sm">
                      <p>
                        To prove that all of our draws are 100% fair we do them
                        live. This will happen via our social platforms and will
                        be saved for later viewing.
                      </p>
                      <p class="mb-0">
                        We use Google's random number generator to pick our
                        winner, the start number will be 0 and then the max
                        number is the number of tickets the competition has. We
                        continue drawing from the random number generator until
                        we get a winning number.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card border-0 box-shadow">
                  <div class="card-header">
                    <h3 class="accordion-heading">
                      <a
                        class="collapsed"
                        href="#faq-2"
                        role="button"
                        data-toggle="collapse"
                        aria-expanded="true"
                        aria-controls="faq-2"
                      >
                        How do I find my winning number(s)?
                        <span class="accordion-indicator"></span>
                      </a>
                    </h3>
                  </div>
                  <div class="collapse" id="faq-2" data-parent="#faq">
                    <div class="card-body font-size-sm">
                      <p>
                        There are 3 ways to easily find your winning number!
                      </p>
                      <p class="mb-0">
                        1. Once payment is successful the confirmation page will
                        display the ticket numbers.
                      </p>
                      <p class="mb-0">
                        2. The confirmation email that you receive will also
                        show the ticket numbers.
                      </p>
                      <p class="mb-0">
                        3. Under the account section - Orders -
                        click on one of the orders and you will see your ticket
                        numbers for each competition.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card border-0 box-shadow">
                  <div class="card-header">
                    <h3 class="accordion-heading">
                      <a
                        class="collapsed"
                        href="#faq-3"
                        role="button"
                        data-toggle="collapse"
                        aria-expanded="true"
                        aria-controls="faq-3"
                      >
                        When does a competition end?
                        <span class="accordion-indicator"></span>
                      </a>
                    </h3>
                  </div>
                  <div class="collapse" id="faq-3" data-parent="#faq">
                    <div class="card-body font-size-sm">
                      <p>
                        The competition draw date can be found on the entry page
                        for each competition we run.
                      </p>
                      <p class="mb-0">
                        This date will never extend however, if the maximum
                        amount of entries for the competition is sold out before
                        the end date it may be brought forward. If a competition
                        does not sell out this means you have a better chance of
                        winning!
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card border-0 box-shadow">
                  <div class="card-header">
                    <h3 class="accordion-heading">
                      <a
                        class="collapsed"
                        href="#faq-4"
                        role="button"
                        data-toggle="collapse"
                        aria-expanded="true"
                        aria-controls="faq-4"
                      >
                        Are we a scam?<span class="accordion-indicator"></span>
                      </a>
                    </h3>
                  </div>
                  <div class="collapse" id="faq-4" data-parent="#faq">
                    <div class="card-body font-size-sm">
                      <p>The simple answer is no!</p>
                      <p class="mb-0">
                        We are a fully registered limited company in the UK. All
                        of our prize draws are complaint with the UK's Gambling
                        act of 2005. All of our draws are live, using an
                        external number generator to keep it fair and avaliable
                        for everyone to watch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
