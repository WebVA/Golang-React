import React, { useState } from "react";
import { userResendEmailVerification } from "../../../../app/user/userSlice.js";
import { useDispatch } from "react-redux";
import ErrorMessage from "../../../shared/ErrorMessage";
import SuccessMessage from "../../../shared/SuccessMessage";

export default function AccountNotActivated() {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resend = async () => {
    const r = await dispatch(userResendEmailVerification());
    if (r.error) {
      setSuccess('');
      setError(r.error);
      return;
    }

    setSuccess("A new email has been sent to your inbox, please follow the instructions on the email! It may be in your junk folder.");
    setError('');
  }
  return (
    <>
      <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
        <div className="py-2 p-md-3">
          {error && <ErrorMessage msg={error} />}
          {success && <SuccessMessage msg={success} />}
          <div className="row justify-content-center pt-4">
            <div className="col-lg-7 col-md-9 col-sm-11">
              <div className="h2 text-center">
                <i
                  className="far fa-frown text-danger"
                  style={{ fontSize: "1em" }}
                ></i>
              </div>
              <div className="h2 text-center pb-2">Your account is not activated yet!</div>
              <p className="font-size-md text-center pb-3">
                Please activate your account by following the link that we've sent you in the registration email.
          </p>
              <div className="text-center py-3 pb-md-0">
                <button className="btn btn-primary" onClick={resend}>
                  Re-send link
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
