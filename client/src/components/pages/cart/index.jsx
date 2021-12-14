import React, { useState, useEffect } from "react";
import {
  _compCartItems,
  _compCartTotal,
  removeItemFromCompCart,
  updateCompetitionTickets,
  removeTicketsFromCompCart,
} from "../../../app/compCart/cartSlice";
import {
  _token,
  _loggedIn,
  _accountActivated,
  _profile,
} from "../../../app/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import endpoints from "../../../app/constants/endpoints";
import { fetchPostJSON } from "../../../app/helpers/api-helpers";
import EmptyCart from "./EmptyCart";
import { getTicketsToBuy } from "../../../app/ticket/ticketSlice.js";
import { userResendEmailVerification } from "../../../app/user/userSlice.js";
import ErrorMessage from "../../shared/ErrorMessage";
import SuccessMessage from "../../shared/SuccessMessage";
import { displayPrice, convertFloatPriceToInt, isDatePassed } from '../../../app/helpers/utils';
import { addItemToCompCart } from "../../../app/compCart/cartSlice";
import CouponModal from "./CouponModal";
import { getCouponData } from "../../../app/order/orderSlice";

export default function CompCart() {
  const history = useHistory();

  const dispatch = useDispatch();

  const compCartItems = useSelector(_compCartItems);
  const compCartTotal = useSelector(_compCartTotal);

  const token = useSelector(_token);
  const loggedIn = useSelector(_loggedIn);
  const profile = useSelector(_profile);
  const accountActivated = useSelector(_accountActivated);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [coupon, setCoupon] = useState({});

  const [disableProductQuantityChange, setDisableProductQuantityChange] = useState(false); // disable product quantity change while re-adjusting
  // const [paymentMethod, setPaymentMethod] = useState('creditcard');
  const [cartTickets, setCartTickets] = useState({});
  const [show, setShow] = useState(false);

  // billing details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const newCartTickets = {};
    Object.keys(compCartItems).forEach((k, i) => {
      newCartTickets[k] = compCartItems[k].quantity;
    });
    setCartTickets(newCartTickets);
  }, [compCartItems]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setCountry(profile.address.Country.name);
      setAddressLine(profile.address.address_line);
      setCity(profile.address.city);
      setZipCode(profile.address.zip_code);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
  }, [profile])

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);
  const applyCouponCode = async (couponCode) => {
    const r = await dispatch(getCouponData(couponCode));
    handleModalClose();
    if (r.error) {
      setSuccess('');
      setError(r.error);
      setCoupon({});
      return;
    }
    if (!r.result.available) {
      setSuccess('');
      setError('This coupon code was already used');
      setCoupon({});
      return;
    }
    setError('');
    setCoupon(r.result);
  }

  const updateTicketQuantityBeforeBuy = async (product, newQuantity) => {
    setDisableProductQuantityChange(true);
    const oldQuantity = product.quantity;

    if (oldQuantity < newQuantity) { // increase
      const newProduct = {...product, quantity: (newQuantity - oldQuantity)};

      const tryToBuyTicketsResponse = await dispatch(getTicketsToBuy(newQuantity - oldQuantity, product.competition));
  
      if (tryToBuyTicketsResponse.error) {
        setError(tryToBuyTicketsResponse.error);
        return;
      }
  
      newProduct.tickets = tryToBuyTicketsResponse.result;
  
      const second = 1000;
      const minute = 60 * second;
  
      newProduct.ticketsValidTill = Date.now() + (10 * minute)
  
      const error = dispatch(addItemToCompCart(newProduct));
      if (error) {
        setError(error);
        setCartTickets({...cartTickets, [product.id]: compCartItems[product.id].quantity});
      }
    } else if (oldQuantity > newQuantity) { // decrease
      const removeQuantity = oldQuantity - newQuantity;
      const error = dispatch(removeTicketsFromCompCart(product, removeQuantity));
      if (error) {
        setError(error);
      }
    }

    setDisableProductQuantityChange(false);
  };

  const handleCompCheckout = async (e) => {
    e.preventDefault();
    setError("");
    let subTotalAmount = 0;

    for (let k in compCartItems) {
      const i = compCartItems[k];
      const amount = convertFloatPriceToInt((i.price));

      if (isDatePassed(i.ticketsValidTill)) {

        const tryToBuyTicketsResponse = await dispatch(getTicketsToBuy(i.quantity, i.competition));

        if (tryToBuyTicketsResponse.error) {
          setError(`${i.competition.title}:  ${tryToBuyTicketsResponse.error}`);
          return;
        }

        const newTicks = tryToBuyTicketsResponse.result;

        dispatch(updateCompetitionTickets(k, newTicks));

      } else {
        // item.description = `tickets: ${i.tickets}`;
      }

      subTotalAmount += amount * i.quantity;
    }

    const totalAmount = Math.max((subTotalAmount - discountPrice(subTotalAmount)).toFixed(2), 0);
    subTotalAmount = subTotalAmount.toFixed(2);

    if (totalAmount === 0) {
      const sessionId = (new Date()).getTime().toString() + (Math.floor(Math.random() * 9000) + 1000).toString();
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("totalAmount", totalAmount);
      localStorage.setItem("subTotalAmount", subTotalAmount);
      
      history.push({
        pathname: 'payment-success',
        search: '?session_id=' + sessionId,
      });
      return;
    }
    const fetchOptions = {
      url: endpoints.server + endpoints.paytriotCreateLink,
      data: { totalAmount: +totalAmount, type: 'creditcard' },
      token: token,
    };
    const response = await fetchPostJSON(fetchOptions);

    if (response.error) {
      console.error(response.error);
      return;
    }

    localStorage.setItem("sessionId", response.result.sessionId);
    localStorage.setItem("totalAmount", totalAmount);
    localStorage.setItem("subTotalAmount", subTotalAmount);
    const paytriotResponse = JSON.parse(response.result.requestLink);

    if (paytriotResponse.payment_request_link_url) {
      window.location.href = paytriotResponse.payment_request_link_url;
    } else {
      console.log(response);
    }
  };

  if (Object.values(compCartItems).length === 0) {
    return <EmptyCart />;
  }

  const resendEmail = async () => {
    const r = await dispatch(userResendEmailVerification());
    if (r.error) {
      setSuccess('');
      setError(r.error);
      return;
    }

    setSuccess("A new email has been sent to your inbox, please follow the instructions on the email!");
    setError('');
  }

  const discountPrice = (totalPrice) => {
    if (coupon.coupon_type === "amount_off") {
      return coupon.amount;
    } else if(coupon.coupon_type === "percent_off") {
      return totalPrice * coupon.amount / 100.0;
    }
    return 0;
  }

  const displayDiscountPrice = (totalPrice) => {
    return "- " + displayPrice(discountPrice(totalPrice)) + (coupon.coupon_type === "percent_off" ? ` (${coupon.amount} %)` : "");
  }

  const displayTotalPrice = (totalPrice) => {
    return displayPrice(Math.max(totalPrice - discountPrice(totalPrice), 0));
  }
  return (
    <>
      <CouponModal
        show={show}
        handleClose={handleModalClose}
        handleApply={applyCouponCode}
      />
      <form className="cs-sidebar-enabled cs-sidebar-right needs-validation" noValidate>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 cs-content py-4">
              <nav aria-label="breadcrumb">
                <ol className="py-1 my-2 breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/running-competitions">Shop</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                </ol>
              </nav>
              <h1 className="mb-3 pb-4">Checkout</h1>
              {error && <ErrorMessage msg={error} />}
              {success && <SuccessMessage msg={success} />}
              {coupon.available
                ? (
                  <div className="alert alert-success font-size-md mb-5" role="alert">
                    <i className="fe-check-circle font-size-xl mt-n1 mr-3"></i>
                    Your coupon code has been set successfully!{" "}
                    <span className='alert-link' onClick={handleModalShow}>Click here to change</span>
                  </div>
                )
                : (
                <div className="alert alert-info font-size-md mb-5" role="alert">
                  <i className="fe-alert-circle font-size-xl mt-n1 mr-3"></i>
                  Have a coupon code?{" "}
                  <span className='alert-link' onClick={handleModalShow}>Click here to enter your code</span>
                </div>
              )}
              <h2 className="h3 pb-3">Billing details</h2>
              <div className="row mb-4">
                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="ch-fn">First name<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="text" id="ch-fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="ch-ln">Last names<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="text" id="ch-ln" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-company">Company name</label>
                  <input className="form-control" type="text" id="ch-company" />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-country">Country<sup className="text-danger ml-1">*</sup></label>
                  <select
                    className="form-control custom-select"
                    id="ch-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                    required
                  >
                    <option value="" disabled hidden>Choose country</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Francee">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="UK">UK</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-address">Street address<sup
                      className="text-danger ml-1">*</sup></label>
                  <input
                    className="form-control"
                    type="text"
                    id="ch-address"
                    placeholder="House number and street name"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required />
                </div>
                <div className="col-12 form-group">
                  <input className="form-control" type="text" placeholder="Apartment, suite, unit, etc. (optional)" />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-city">Town / City<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="text" id="ch-city" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-county">County</label>
                  <input className="form-control" type="text" id="ch-county" />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ch-postcode">Postcode<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="text" id="ch-postcode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                </div>
                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="ch-phone">Phone<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="text" id="ch-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="ch-email">Email address<sup className="text-danger ml-1">*</sup></label>
                  <input className="form-control" type="email" id="ch-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
            </div>
            <div className="col-lg-4 cs-sidebar bg-secondary pt-5 pl-lg-4 pb-md-2">
              <div className="pl-lg-4 mb-3 pb-5">
                <h2 className="h4 pb-3">Your cart</h2>
                {Object.keys(compCartItems).map((k, i) => {
                  const item = compCartItems[k];
                  return (
                    <div className="media align-items-center mb-4" key={k}>
                      <Link className="d-block" to={`/competition/${k}`}>
                        <img className="rounded" width="60" src={item.image} alt="Product" />
                      </Link>
                      <div className="media-body pl-2 ml-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="mr-3">
                            <h4 className="nav-heading font-size-md mb-1">
                              <Link className="font-weight-medium" to={`/competition/${k}`}>{item.name}</Link>
                            </h4>
                            <div className="d-flex align-items-center font-size-sm">
                              <span className="mr-2">{displayPrice(item.price)}</span>
                              <span className="mr-2">x</span>
                              <input
                                className="form-control form-control-sm bg-image-0 px-2"
                                type="number"
                                style={{maxWidth: "5rem"}}
                                onChange={(event) => {
                                  let newQuantity = Math.max(1, +event.target.value);
                                  if (item?.competition?.max_tickets_per_person) {
                                    newQuantity = Math.min(item?.competition?.max_tickets_per_person, newQuantity);
                                  }
                                  setCartTickets({...cartTickets, [k]: newQuantity});
                                }}
                                onBlur={() => updateTicketQuantityBeforeBuy(compCartItems[k], cartTickets[k])}
                                value={cartTickets[k]}
                                min="1"
                                max="1000"
                                disabled={disableProductQuantityChange}
                              />
                            </div>
                          </div>
                          <div
                            className="pl-3 border-left"
                            onClick={() => {
                              dispatch(removeItemFromCompCart(k));
                            }}
                          >
                            <span className="d-block text-danger text-decoration-none font-size-xl" href="#" data-toggle="tooltip" title="Remove">
                              <i className="fe-x-circle"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <hr className="mb-4" />
                {coupon.available && (<div className="d-flex justify-content-between mb-2">
                  <span className="font-size-sm mb-0">Sub Total:</span>
                  <span className="font-size-sm mb-0">{displayPrice(compCartTotal)}</span>
                </div>)}
                {coupon.available && (<div className="d-flex justify-content-between mb-2">
                  <span className="font-size-sm mb-0">Discount:</span>
                  <span className="font-size-sm mb-0">{displayDiscountPrice(compCartTotal)}</span>
                </div>)}
                <div className="d-flex justify-content-between mb-3">
                  <span className="h6 mb-0">Total:</span>
                  <span className="h6 mb-0">{displayTotalPrice(compCartTotal)}</span>
                </div>
                {/* <div className="accordion accordion-alt pt-4 mb-grid-gutter" id="payment-methods">
                  <div className={"card border-0 box-shadow" + (paymentMethod === 'creditcard' ? ' card-active' : '')}>
                    <div className="card-header p-3">
                      <div className="p-1">
                        <div className="custom-control custom-radio" data-target="#credit-card">
                          <input
                            className="custom-control-input"
                            type="radio"
                            id="credit-card-radio"
                            checked={paymentMethod === 'creditcard'}
                            onChange={() => setPaymentMethod('creditcard')}
                          />
                          <label className="custom-control-label d-flex align-items-center h6 mb-0" htmlFor="credit-card-radio">
                            <span>Credit Card</span>
                            <img className="ml-3" width="130" src="img/shop/cards.png" alt="Accepted cards" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"card border-0 box-shadow" + (paymentMethod === 'paypal' ? ' card-active' : '')}>
                    <div className="card-header p-3">
                      <div className="p-1">
                        <div className="custom-control custom-radio" data-target="#paypal">
                          <input
                            className="custom-control-input"
                            type="radio"
                            id="paypal-radio"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                          />
                          <label className="custom-control-label d-flex align-items-center h6 mb-0" htmlFor="paypal-radio">
                            <span>PayPal</span>
                            <img className="ml-3" width="20" src="img/shop/paypal.png" alt="PayPal" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {!loggedIn && (
                  <div className="d-flex justify-content-between mb-4">
                    <span className="h6 mb-0">
                      Please login to purchase: <Link to="/login?returnUrl=/cart">Login</Link>
                    </span>
                  </div>
                )}
                {loggedIn && !accountActivated && (
                  <div className="d-flex justify-content-between mb-4">
                    <p className="h6 mb-0">
                      Your account is not activated yet! Please activate your account by following the link that we've sent you in the registration email.
                      <div className="hand-hover d-inline" style={{ color: `var(--primary)` }} onClick={resendEmail}>
                        Re-send link
                      </div>
                    </p>
                  </div>
                )}
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  onClick={handleCompCheckout}
                  disabled={!loggedIn || !accountActivated}
                >
                  Place order
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
