import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../../app/user/userSlice";
import { addContactToAllSendGridList } from "../../../app/helpers/sendGrid-helpers.js";

export default function SignUp() {
  const [err, setErr] = useState(null);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (confirmPassword && formState.password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match!");
    } else {
      setConfirmPasswordError(null);
    }
  }, [confirmPassword, formState.password]);

  const formOnChange = (e) => {
    e.preventDefault();
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const onConformPasswordChange = (e) => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
  };

  const signupFunc = async (e) => {
    e.preventDefault();
    setErr(null);
    const res = await dispatch(signupUser(formState));
    let [n1, n2] = formState.name.split(" ");
    await addContactToAllSendGridList({
      email: formState.email,
      first_name: n1,
      last_name: n2,
    });
    if (res.error) {
      setErr(res.error);
      return;
    }

    setSuccess(true);
    // history.push("/verify-account");
  };

  // if (loading) return <Loading />;

  return (
    <>
      <div class="col-md-6 offset-lg-1">
        <h2 class="h3">No account? Sign up</h2>
        <p class="font-size-ms text-muted">
          Registration takes less than a minute but gives you full control over
          your orders.
        </p>
        {success && (
          <div className="alert alert-success alert-dismissible fade show text-center">
            We have sent a verification email, please follow the instructions to
            verify your account. It may be in your junk folder.
          </div>
        )}
        {err && (
          <div className="alert alert-danger alert-dismissible fade show text-center">
            {err}
          </div>
        )}
        <form class="row needs-validation" novalidate="">
          <div class="col-sm-6 form-group">
            <label class="form-label" for="nameReg">
              Full name<sup class="text-danger ml-1">*</sup>
            </label>
            <input
              className="form-control"
              type="text"
              name="name"
              id="nameReg"
              placeholder="Full name"
              value={formState.name}
              onChange={formOnChange}
              required
            />
            <div class="invalid-feedback">Please enter you full name!</div>
          </div>
          <div class="col-sm-6 form-group">
            <label class="form-label" for="emailReg">
              Email address<sup class="text-danger ml-1">*</sup>
            </label>
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
            <div class="invalid-feedback">
              Please enter a valid email address!
            </div>
          </div>
          <div class="col-sm-6 form-group">
            <label class="form-label" for="passwordReg">
              Password<sup class="text-danger ml-1">*</sup>
            </label>
            <input
              className="form-control prepended-form-control"
              type="password"
              id="passwordLogin"
              placeholder="Password"
              required
              name="password"
              value={formState.password}
              onChange={formOnChange}
            />
            <div class="invalid-feedback">Please provide password!</div>
          </div>
          <div class="col-sm-6 form-group">
            <label class="form-label" for="passwordConfirmReg">
              Confirm password<sup class="text-danger ml-1">*</sup>
            </label>
            <input
              className="form-control prepended-form-control"
              type="password"
              id="passwordLogin"
              placeholder="Password"
              required
              name="password"
              value={confirmPassword}
              onChange={onConformPasswordChange}
            />
            {confirmPasswordError && (
              <p style={{ color: "red" }}>{confirmPasswordError}</p>
            )}
            <div class="invalid-feedback">Password doesn't match!</div>
          </div>
          <div class="col-sm-6 pt-2">
            <button
              class="btn btn-primary btn-block"
              className="btn btn-primary btn-block"
              type="button"
              id="btnRegSubmit"
              disabled={
                !formState.email ||
                !formState.name ||
                !formState.password ||
                confirmPasswordError
              }
              onClick={signupFunc}
            >
              Sign up
            </button>
          </div>
        </form>
        <div
          class="alert alert-success mt-2 collapse"
          role="alert"
          id="registerSuccess"
          style={{ display: "none" }}
        >
          <i class="fe-check-circle font-size-xl mt-n1 mr-3"></i>
        </div>
        <div
          class="alert alert-danger mt-2 collapse"
          role="alert"
          id="registerError"
          style={{ display: "none" }}
        >
          <i class="fe-x-circle font-size-xl mt-n1 mr-3"></i>
        </div>
      </div>
    </>
  );
}
