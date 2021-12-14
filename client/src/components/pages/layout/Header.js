import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { _loggedIn } from "../../../app/user/userSlice";
import AdminMenu from "./AdminMenu";
import { _compCartCount } from "../../../app/compCart/cartSlice";
import { useLocation } from "react-router-dom";
import useScroller from "../../hooks/useScroller.jsx";
import NavBarLink from "../../shared/NavBarLink.jsx";

export default function Header() {
  const isLoggedIn = useSelector(_loggedIn);
  const compCartCount = useSelector(_compCartCount);
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const scrolled = useScroller();

  useEffect(() => {
    if (
      location.pathname.match(/\/admin\/.*/) ||
      location.pathname.match(/\/account\/.*/)
    ) {
      setDark(true);
    } else {
      setDark(false);
    }
  }, [location]);

  const CartIcon = () => (
    <div className="navbar-tool mr-2">
      <Link
        className="navbar-tool-icon-box"
        to="/cart"
        data-toggle="offcanvas"
        data-offcanvas-id="shoppingCart"
      >
        <i className="fe-shopping-cart"></i>
        {compCartCount !== 0 && (
          <span className="navbar-tool-badge">{compCartCount}</span>
        )}
      </Link>
    </div>
  );

  const IconSpacer = () => (
    <div className="border-left mr-2" style={{ height: "30px" }}></div>
  );

  const ProfileIcon = ({ path }) => (
    <div className="navbar-tool d-none d-sm-flex">
      <Link
        className="navbar-tool-icon-box mr-2"
        to={path}
        data-toggle="modal"
        data-view="#modal-signin-view"
      >
        <i className="fe-user"></i>
      </Link>
    </div>
  );

  const Content = (
    <>
      <div
        className="container px-0 px-xl-3"
        style={{ color: `${!dark ? "#737491 !important" : "#fff"}` }}
      >
        <button
          className="navbar-toggler ml-n2 mr-4"
          type="button"
          data-toggle="offcanvas"
          data-offcanvas-id="primaryMenu"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link
          className="navbar-brand order-lg-1 mx-auto ml-lg-0 pr-lg-2 mr-lg-4"
          to="/"
        >
          <img
            className="d-none d-lg-block"
            width="153"
            src={
              process.env.PUBLIC_URL +
              `${
                dark && scrolled < 10
                  ? "/img/logo/logo-light.png"
                  : "/img/logo/logo-dark.jpg"
              }`
            }
            alt="Comp Performance"
          />
          <img
            className="d-lg-none"
            width="58"
            src={
              process.env.PUBLIC_URL +
              `${
                dark && scrolled < 10
                  ? "/img/logo/logo-icon-light.png"
                  : "/img/logo/logo-icon.png"
              }`
            }
            alt="Comp Performance"
          />
        </Link>
        <div className="d-flex align-items-center order-lg-3 ml-lg-auto">
          {isLoggedIn ? (
            <>
              <ProfileIcon path="/account/orders" />
              <IconSpacer />
              <CartIcon />
            </>
          ) : (
            <>
              <ProfileIcon path="/login" />
              <IconSpacer />
              <CartIcon />
            </>
          )}
        </div>

        <div
          className={`cs-offcanvas-collapse order-lg-2  ${
            showSidebar ? "show" : ""
          } `}
          id="primaryMenu"
        >
          <div className="cs-offcanvas-cap navbar-box-shadow">
            <h5 className="mt-1 mb-0">Menu</h5>
            <button
              className="close lead"
              type="button"
              data-toggle="offcanvas"
              data-offcanvas-id="primaryMenu"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="cs-offcanvas-body">
            {/* <!-- Menu--> */}
            <ul className="navbar-nav">
              <NavBarLink
                text={"Running Competitions"}
                to="/running-competitions"
                activePattern={/\/running-competitions.*/}
                setShowSidebar={setShowSidebar}
                showSidebar={setShowSidebar}
              />

              {/* <NavBarLink
                text={"Previous Winners"}
                to="/previous-winners"
                activePattern={RegExp('/previous-winners.*')}
                setShowSidebar={setShowSidebar}
                showSidebar={setShowSidebar}
              /> */}

               <NavBarLink
                text={"About Us & FAQ"}
                to="/about"
                activePattern={/\/about.*/}
                setShowSidebar={setShowSidebar}
                showSidebar={setShowSidebar}
              />

             
               <NavBarLink
                text={"Account"}
                to="/account/orders"
                activePattern={/\/account.*/}
                setShowSidebar={setShowSidebar}
                showSidebar={setShowSidebar}
              />

              <AdminMenu />
            </ul>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header
        className={`cs-header navbar navbar-expand-lg navbar-sticky ${
          dark && scrolled < 10
            ? " navbar-dark navbar-floating  "
            : " navbar-light bg-light navbar-box-shadow "
        }  ${showSidebar ? "right15" : ""} ${
          scrolled > 10 ? "navbar-stuck" : ""
        } `}
      >
        {Content}
      </header>
    </>
  );
}
