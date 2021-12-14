import React, { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { subscribeToNewsLetter } from "../../../app/user/userSlice.js";
import { useDispatch } from "react-redux";
import {addContactToSendGridList} from "../../../app/helpers/sendGrid-helpers.js"
import {listsIDs} from "../../../app/constants/sendGrid.js"

export default function NewsLetterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const onChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const subscribe = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("please inter a valid email");
      return;
    }

    const res = dispatch(subscribeToNewsLetter(email));

    if (res.error) {
      setError("error: " + res.error);
      return;
    }

    addContactToSendGridList([listsIDs.NewsletterList], {email: email});
    setEmail("")
    setError(null);
    setSuccess(true);
  };
  return (
    <section className="bg-gradient py-5">
      <div className="container py-2 py-sm-4">
        <div className="row align-items-center">
          <div className="col-xl-6 col-md-7 mb-5 mb-md-0">
            <h2 className="text-light text-center text-md-left">
              Subscribe to our newsletter!
            </h2>
            <p className="text-light mb-grid-gutter text-center text-md-left">
              Never miss a competition or deal again.
            </p>
            <form className="row">
              <div className="col-lg-8 col-md-7 col-sm-8 mb-3 mb-sm-0">
                <input
                  className="form-control"
                  type="email"
                  placeholder="Type your email..."
                  required
                  value={email}
                  onChange={onChange}
                />
                {error && <p className="text-danger pl-3">{error}</p>}

                {success && (
                  <p className="text-success pl-3">
                    Thank you for subscribing to our newsletter.
                  </p>
                )}
              </div>
              <div className="col-lg-4 col-md-5 col-sm-4">
                <button
                  className="btn btn-success btn-block"
                  type="submit"
                  onClick={subscribe}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-5 offset-xl-1">
            <img
              className="d-block mx-auto"
              width="437"
              src="img/demo/software-landing/cta-illustration.svg"
              alt="Illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
