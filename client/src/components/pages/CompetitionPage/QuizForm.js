import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicketsToBuy } from "../../../app/ticket/ticketSlice";
import { prepareProduct } from "../../../app/helpers/cart-helpers";
import { addItemToCompCart } from "../../../app/compCart/cartSlice";
import { Link } from "react-router-dom";

export default function QuizForm({ comp }) {
  const [answer, setAnswer] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const dispatch = useDispatch();
  const [err, setErr] = useState(null);
  const [movedToCart, setMovedToCart] = useState(false);

  const updateTicketQuantityBeforeBuy = async (e) => {
    let q = Math.max(1, Number(e.target.value));
    if (comp?.max_tickets_per_person) {
      q = Math.min(comp?.max_tickets_per_person, q);
    }
    setQuantity(q);
  };

  const addToCart = async (e) => {
    e.preventDefault();
    /**
     * for each ticket:
     * 1- choose an available ticket number,
     * 2- prepare the order item for that ticket
     * 3- add it to shopping cart
     */
    setErr(null);

    const isAnswerRight = answer === comp?.quiz?.correct_answer;
    const product = prepareProduct(comp, answer, isAnswerRight);

    const tryToBuyTicketsResponse = await dispatch(getTicketsToBuy(quantity, comp));

    if (tryToBuyTicketsResponse.error) {
      setErr(tryToBuyTicketsResponse.error);
      return;
    }

    product.tickets = tryToBuyTicketsResponse.result;

    const second = 1000;
    const minute = 60 * second;

    product.ticketsValidTill = Date.now() + (10 * minute)

    let error = dispatch(addItemToCompCart(product));
    if (error) {
      setErr(error);
    } else {
      setMovedToCart(true);
    }
  };

  if (comp?.winner?.ID) {
    return (
      <div className="d-flex mt-4 mb-3 mr-2">
        <div className="btn btn-warning w-100">
          <Link to={`/previous-winner/${comp?.ID}`} className="text-white">
            View Winner
          </Link>
        </div>
      </div>
    );
  }
  if (!comp?.quiz) {
    return <></>;
  }
  return (
    <>
      <form className="cart" >
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <div className="custom-control custom-radio">
                <input
                  onChange={(e) => { setAnswer(1); }}
                  className="custom-control-input"
                  type="radio"
                  name="answer"
                  id="answer1"
                  value={comp?.quiz.option1}
                  data-label="questionAnswerText"
                  required="required"
                />
                <label
                  className="custom-control-label"
                  htmlFor="answer1"
                ></label>
              </div>
            </div>
          </div>
          <label className="form-control mr-2" htmlFor="answer1">
            {comp?.quiz.option1}
          </label>
        </div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <div className="custom-control custom-radio">
                <input
                  onChange={(e) => {
                    setAnswer(2);
                  }}
                  className="custom-control-input"
                  type="radio"
                  name="answer"
                  id="answer2"
                  value={comp?.quiz.option2}
                  data-label="questionAnswerText"
                  required="required"
                />
                <label
                  className="custom-control-label"
                  htmlFor="answer2"
                ></label>
              </div>
            </div>
          </div>
          <label className="form-control mr-2" htmlFor="answer2">
            {comp?.quiz.option2}
          </label>
        </div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <div className="custom-control custom-radio">
                <input
                  onChange={(e) => {
                    setAnswer(3);
                  }}
                  className="custom-control-input"
                  type="radio"
                  name="answer"
                  id="answer3"
                  value={comp?.quiz.option3}
                  data-label="questionAnswerText"
                  required="required"
                />
                <label
                  className="custom-control-label"
                  htmlFor="answer3"
                ></label>
              </div>
            </div>
          </div>
          <label className="form-control mr-2" htmlFor="answer3">
            {comp?.quiz.option3}
          </label>
        </div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <div className="custom-control custom-radio">
                <input
                  onChange={(e) => {
                    setAnswer(4);
                  }}
                  className="custom-control-input"
                  type="radio"
                  name="answer"
                  id="answer4"
                  value={comp?.quiz.option4}
                  data-label="questionAnswerText"
                  required="required"
                />
                <label
                  className="custom-control-label"
                  htmlFor="answer4"
                ></label>
              </div>
            </div>
          </div>
          <label className="form-control mr-2" htmlFor="answer4">
            {comp?.quiz.option4}
          </label>
        </div>
        {err && <div className="d-flex mt-4 mb-3 mr-2">
          <p style={{ color: "red" }}>{err}</p>
        </div>}

        {movedToCart ? (
          <Link to="/cart" className="text-white">
            <div className="d-flex mt-4 mb-3 mr-2">
              <div className="btn btn-success w-100"> View Cart</div>
            </div>
          </Link>
        ) : (
          <div className="d-flex mt-4 mb-3 mr-2">
            <input
              onChange={updateTicketQuantityBeforeBuy}
              className="form-control mr-3"
              type="number"
              style={{ width: "5rem" }}
              value={quantity}
              min={1}
              max={comp?.max_tickets_per_person}
              name="quantity"
              id="qvaltemp"
            />
            <button
              className="btn btn-primary btn-block"
              type="submit"
              value="qbuttontemp"
              onClick={addToCart}
              disabled={!answer}
            >
              Add to Cart
            </button>
          </div>
        )}
      </form>
    </>
  );
}
