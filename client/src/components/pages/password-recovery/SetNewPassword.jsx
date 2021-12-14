import React, { useState}from 'react';
import endpoints from "../../../app/constants/endpoints";
import { fetchPostJSON } from "../../../app/helpers/api-helpers";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";

export default function SetNewPassword() {
  const {token} = useParams();
  const [pass1, setPass1] = useState(""); 
  const [pass2, setPass2] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false)

  
  const setNewPasswordFunc = async(e) => {
    e.preventDefault();
    if(pass1 !== pass2) {
      setError("passwords don't match");
      return;
    }
    const fetchOptions = {
      url: endpoints.server + endpoints.setNewPassword + '/' + token,
      data: {
        password: pass1,
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
            <h1 className="h2 pb-3">Set new password</h1>
            <p className="font-size-sm">
              Change your password here. If you have not requested to change, please contact us and close this page.
            </p>
            {/* success */}
           {success && (
          <div className="alert alert-success alert-dismissible fade show text-center">
           your password has been successfully changed, please use your new password to <Link to="/login">Login</Link>

          </div>
        )}

         {/* Error */}
           {error && (
          <div className="alert alert-danger alert-dismissible fade show text-center">
           {error}
          </div>
        )}
           
            <div className="bg-secondary rounded-lg px-3 py-4 p-sm-4">
              <form className="needs-validation p-2" novalidate>
                <div className="form-group">
                  <label className="form-label" for="recovery-email">
                    Enter your new password
                  </label>
                  <input
                    className="form-control"
                    type="pass1"
                    value={pass1}
                    onChange={(e) => { setPass1(e.target.value) }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" for="recovery-email">
                    Confirm your new password
                  </label>
                  <input
                    className="form-control"
                    type="pass2"
                     value={pass2}
                    onChange={(e) => { setPass2(e.target.value) }}
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit" onClick={setNewPasswordFunc}>
                  Get new password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}
