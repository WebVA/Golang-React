/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { verifyUserAccount } from "../../../app/user/userSlice";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function VerifyAccount() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (token) {
        const res = await dispatch(verifyUserAccount(token));
        if (res.error) {
          setError("error: " + res.error);
          return;
        }
        setSuccess(true);
      }
    })();
  }, [token]);

  if (!token) {
    history.push("/");
  }

  return (
    <div className="w-100 full-height p-5">
      {error && (
        <>
          <div className="alert alert-danger alert-dismissible fade show text-center">
            <h1>{error}</h1>
          </div>
          <div className="w-100 m-auto text-center">
            <a href="/">
              <button type="button" className="btn btn-primary">
                go to homepage
              </button>
            </a>
          </div>
        </>
      )}
      {success && (
        <>
        <div className="container py-5 py-sm-6 py-md-7">
        <div className="row justify-content-center pt-4">
          <div className="col-lg-7 col-md-9 col-sm-11">
            <div className="h2 text-center"><i className="far fa-check-circle mr-3 text-success" style={{fontSize: "1em"}}></i>Email Verified!</div>
            <p className="font-size-md text-center pt-2 pb-2">Your account was successfully verified, please login to fully use our site.</p>
            <a href="/login">
              <button type="button" className="btn btn-primary btn-block">
                Login
              </button>
            </a>
          </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
