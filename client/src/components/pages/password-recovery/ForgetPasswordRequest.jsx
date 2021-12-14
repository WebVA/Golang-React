import React, {useState} from "react";
import endpoints from "../../../app/constants/endpoints";
import { fetchPostJSON } from "../../../app/helpers/api-helpers";
import validator from "validator";

export default function ForgetPasswordRequest() {
  const [email, setEmail] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false)

  const registerNewRecoveryRequest = async(e) => {
    e.preventDefault();
    if(!validator.isEmail(email)) {
      setError("please enter a valid email");
      return;
    }
    const fetchOptions = {
      url: endpoints.server + endpoints.requestNewPassword,
      data: {
        email,
      }
    }

    const res = await fetchPostJSON(fetchOptions);

    if(res.error){
      setError("error: " + res.error)
      return;
    }

    setSuccess(true)

  }
  return (
    <div className="container py-5 py-sm-6 py-md-7">
      <div className="row justify-content-center pt-4">
        <div className="col-lg-7 col-md-9 col-sm-11">
          <h1 className="h2 pb-3">Forgot your password?</h1>
          {/* success */}
           {success && (
          <div className="alert alert-success alert-dismissible fade show text-center">
            Email sent, please follow the instructions to reset your password.
          </div>
        )}

         {/* Error */}
           {error && (
          <div className="alert alert-danger alert-dismissible fade show text-center">
           {error}
          </div>
        )}
          <p className="font-size-sm">
            Change your password in three easy steps. This helps to keep your
            new password secure.
          </p>
          <ul className="list-unstyled font-size-sm pb-1 mb-4">
            <li>
              <span className="text-primary font-weight-semibold mr-1">1.</span>Fill
              in your email address below.
            </li>
            <li>
              <span className="text-primary font-weight-semibold mr-1">2.</span>
              We'll email you a temporary code.
            </li>
            <li>
              <span className="text-primary font-weight-semibold mr-1">3.</span>Use
              the code to change your password on our secure website.
            </li>
          </ul>
          <div className="bg-secondary rounded-lg px-3 py-4 p-sm-4">
            <form className="needs-validation p-2" novalidate>
              <div className="form-group">
                <label className="form-label" for="recovery-email">
                  Enter your email address
                </label>
                <input
                  className="form-control"
                  type="email"
                  required
                  id="recovery-email"
                  value = {email}
                  onChange={(e) => { setEmail(e.target.value); }}
                />
                <div className="invalid-feedback">
                  Please provide a valid email address!
                </div>
              </div>
              <button className="btn btn-primary" type="submit" onClick={registerNewRecoveryRequest}>
                Get new password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
