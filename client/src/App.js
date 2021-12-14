/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReactGA from "react-ga";

import { GoogleAnalyticsID } from "./app/constants/constants";

import {
  _competitions,
  getAllCompetitionsFromServer,
} from "./app/competition/competitionSlice";
import {
  _categories,
  getAllCategoriesFromServer,
} from "./app/competition/categorySlice";
import {
  checkToken,
  checkAdminToken,
  fetchUserInfo,
} from "./app/user/userSlice";
import { getAppOptions } from "./app/appState/appSlice";

import useGoogleAnalytics from "./components/hooks/useGoogleAnalytics";

import Footer from "./components/pages/layout/Footer";
import Header from "./components/pages/layout/Header";
import BackToTop from "./components/pages/layout/BackToTop";
import Loading from "./components/pages/layout/Loading";
import VerifyAccount from "./components/pages/verifyAccount/index.jsx";

const Home = lazy(() => import("./components/pages/home"));
const RunningCompetitions = lazy(() => import("./components/pages/competitions/RunningCompetitions"));
const AdminRouter = lazy(() => import("./components/admin/AdminRouter"));
const LoginPage = lazy(() => import("./components/pages/login"));
const CompetitionPage = lazy(() => import("./components/pages/CompetitionPage"));
// const PreviousWinners = lazy(() => import("./components/pages/previous-winners/"));
const PagePreviousWinner = lazy(() => import("./components/pages/PagePreviousWinner"));
const CategoryPage = lazy(() => import("./components/pages/CategoryPage"));
const AccountRouter = lazy(() => import("./components/pages/account/AccountRouter"));
const CompCart = lazy(() => import("./components/pages/cart/index.jsx"));
const PaymentSuccessPage = lazy(() => import("./components/pages/payment-success/index.jsx"));
const AboutPage = lazy(() => import("./components/pages/about/index.jsx"));
const NotFound = lazy(() => import("./components/pages/layout/NotFound.jsx"));
const AllCategories = lazy(() => import("./components/pages/categories/index.jsx"));
const ForgetPasswordRequest = lazy(() => import("./components/pages/password-recovery/ForgetPasswordRequest.jsx"));
const SetNewPassword = lazy(() => import("./components/pages/password-recovery/SetNewPassword.jsx"));
const TCS = lazy(() => import("./components/pages/tcs/index.jsx"));

function App() {
  // const loading = useSelector(_loading);
  const dispatch = useDispatch();
  const competitions = useSelector(_competitions);
  const categories = useSelector(_categories);

  ReactGA.initialize(GoogleAnalyticsID);

  useGoogleAnalytics();

  useEffect(() => {
    dispatch(getAppOptions());
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getAllCategoriesFromServer());
    }
  }, []);

  useEffect(() => {
    if (!competitions || competitions.length === 0) {
      dispatch(getAllCompetitionsFromServer());
    }
  }, []);

  useEffect(() => {
    (async () => {
      const r1 = await dispatch(checkToken());
      if (r1 && !r1.error) {
        await dispatch(fetchUserInfo());
        await dispatch(checkAdminToken());
      }
    })();
  }, []);

  return (
    <>
      {/*  Every thing should happen inside this main  */}

      <main className="cs-page-wrapper align-items-center">
        <Header />
        <Suspense fallback={<Loading />}>
          <Switch>
            {/* user routes */}
            <Route path="/" exact>
              <Home />
            </Route>

            <Route path="/about" exact>
              <AboutPage />
            </Route>

            <Route path="/running-competitions" exact>
              <RunningCompetitions />
            </Route>

            {/* admin routes */}
            <Route path="/admin">
              <AdminRouter />
            </Route>

            <Route path="/account">
              <AccountRouter />
            </Route>

            <Route path="/cart" exact>
              <CompCart />
            </Route>

            <Route path="/categories" exact>
              <AllCategories />
            </Route>

            <Route path="/category/:catID" exact>
              <CategoryPage />
            </Route>

            <Route path="/competition/:id" exact>
              <CompetitionPage />
            </Route>

            <Route path="/forget-password" exact>
              <ForgetPasswordRequest />
            </Route>

            <Route path="/login">
              <LoginPage />
            </Route>

            {/* <Route path="/previous-winners" exact>
              <PreviousWinners numberOfItems={8} />
            </Route> */}

            <Route path="/previous-winner/:competitionID" exact>
              <PagePreviousWinner />
            </Route>

            <Route path="/payment-success">
              <PaymentSuccessPage />
            </Route>

            <Route path="/set-new-password/:token" exact>
              <SetNewPassword />
            </Route>

            <Route path="/tcs" exact>
              <TCS />
            </Route>

            <Route path="/verify-email/:token" exact>
              <VerifyAccount />
            </Route>

            <Route path="/not-found" exact>
              <NotFound />
            </Route>

            <NotFound />
          </Switch>
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
