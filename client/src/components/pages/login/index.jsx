import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";


export default function LoginPage() {


  return (
    <>
      <div class="container py-5 py-md-7">
        <div class="row align-items-center pt-2">
          <div class="col-md-6 col-lg-5 mb-5 mb-md-0">
            <SignIn />
          </div>
          <SignUp />
        </div>
      </div>
    </>
  );
}
