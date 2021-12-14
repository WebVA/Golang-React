import React from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { _loggedIn, _accountActivated } from "../../../app/user/userSlice";

import AccountOrders from "./orders";
import Messages from "./messages/index.jsx";
import ProfileInfo from "./profile-info";
import NotificationSettings from "./notification-settings/index.jsx";
import AccountNotActivated from "./not-activated/index";
import Rewards from "./rewards/index.jsx"
import RewardsInformation from "./rewards/RewardsInformation"

export default function AccountRouter() {
  const history = useHistory();
  const loggedIn = useSelector(_loggedIn);
  const accountActivated = useSelector(_accountActivated);

  if (!loggedIn) {
    history.push("/login");
  }

  if (loggedIn && !accountActivated) return <AccountNotActivated />;

  return (
    <>
      <Switch>
        <Route path="/account/orders" exact>
          <AccountOrders />
        </Route>
        <Route path="/account/messages" exact>
          <Messages />
        </Route>
        <Route path="/account/profile-info" exact>
          <ProfileInfo />
        </Route>
        <Route path="/account/notification-settings" exact>
          <NotificationSettings />
        </Route>
        <Route path="/account/rewards" exact>
          <Rewards />
        </Route>
        <Route path="/account/rewards/information" exact>
          <RewardsInformation />
        </Route>
      </Switch>
    </>
  );
}
