import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "use-shopping-cart";
import { BrowserRouter as Router } from "react-router-dom";

// Remember to add your public Stripe key
const REACT_APP_STRIPE_API_PUBLIC = process.env.REACT_APP_STRIPE_API_PUBLIC ? process.env.REACT_APP_STRIPE_API_PUBLIC :
  "pk_test_51HUfh3IvWhaIeQ8bhKWJiyj8mVA9XDigkKFuCI41zcRNng4wQyHGmDo7BkSfhg2iR22ziwWjZMVnMrHY6BHwhnDP00cPXucB4N";
const stripePromise = loadStripe(REACT_APP_STRIPE_API_PUBLIC);

ReactDOM.render(
  <React.StrictMode>
    <CartProvider
      mode="checkout-session"
      stripe={stripePromise}
      successUrl="stripe.com"
      cancelUrl="twitter.com/dayhaysoos"
      currency="GBP"
      allowedCountries={["GB"]}
      billingAddressCollection={true}
      shippingAddressCollection= {{allowedCountries: ['US', 'CA']}}
    >
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </CartProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
