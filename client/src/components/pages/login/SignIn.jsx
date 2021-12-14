import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../app/user/userSlice";
import { useHistory } from "react-router";
import { _loading } from "../../../app/appState/appSlice";
import { Link } from "react-router-dom";
import queryString from "query-string";

export default function SignIn() {
  const [err, setErr] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const loading = useSelector(_loading);
  const [showP, setShowP] = useState(false);

  const formOnChange = (e) => {
    e.preventDefault();
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const loginFunc = async (e) => {
    e.preventDefault();
    setErr(null);
    const res = await dispatch(login(formState.email, formState.password));
    if (res.error) {
      setErr(res.error);
      return;
    }

    if (res.result.user.email_verified === false) {
      history.push("/verify-account");
    }
    const query = window.location.search ? window.location.search : '';
    const searchParams = queryString.parse(query);
    const returnUrl = searchParams.returnUrl ? searchParams.returnUrl.trim() : '/';
    history.push(returnUrl);
  };

  // if (loading) return <Loading />;

  return (
    <>
      <div class="bg-secondary px-4 py-5 p-sm-5 rounded-lg">
        <h1 class="h3 pt-1">Sign in</h1>
        <p class="font-size-ms text-muted">
          Sign in to your account using email and password provided during
          registration.
        </p>
        {err && (
          <div className="alert alert-danger alert-dismissible fade show text-center">
            {err}
          </div>
        )}
        <form class="needs-validation" novalidate="">
          <div class="input-group-overlay form-group">
            <div class="input-group-prepend-overlay">
              <span class="input-group-text">
                <i class="fe-mail"></i>
              </span>
            </div>
            <input
              className="form-control prepended-form-control"
              type="email"
              id="emailLogin"
              placeholder="Email"
              required
              name="email"
              value={formState.email}
              onChange={formOnChange}
            />
          </div>
          <div class="input-group-overlay cs-password-toggle form-group">
            <div class="input-group-prepend-overlay">
              <span class="input-group-text">
                <i class="fe-lock"></i>
              </span>
            </div>
            <input
              className="form-control prepended-form-control"
              type={showP ? "text" : "password"}
              id="passwordLogin"
              placeholder="Password"
              required
              name="password"
              value={formState.password}
              onChange={formOnChange}
            />
            <label class="cs-password-toggle-btn">
              <input class="custom-control-input" type="checkbox" />
              <i
                class="fe-eye cs-password-toggle-indicator"
                onClick={() => {
                  setShowP(!showP);
                }}
              ></i>
              <span class="sr-only">Show password</span>
            </label>
          </div>
          <div class="d-flex justify-content-between align-items-center form-group">
            <div class="custom-control custom-checkbox">
              <input
                class="custom-control-input"
                type="checkbox"
                id="keepSigned"
              />
              <label class="custom-control-label" for="keepSigned">
                Keep me signed in
              </label>
            </div>
            <Link class="nav-link-style font-size-ms" to="/forget-password">
              Forgot password?
            </Link>
          </div>

          <button
            class="btn btn-primary btn-block"
            type="button"
            onClick={loginFunc}
            disabled={!formState.email || !formState.password || loading}
          >
            Sign in
          </button>
        </form>
        <div
          class="alert alert-danger mt-2 collapse"
          role="alert"
          id="loginError"
          //   style={{ display: "none" }}
        >
          <i class="fe-x-circle font-size-xl mt-n1 mr-3"></i>
        </div>
      </div>
    </>
  );
}
