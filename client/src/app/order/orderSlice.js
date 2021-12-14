import { createSlice } from "@reduxjs/toolkit";
import endpoints from "../constants/endpoints";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
import { prepareOrderToBeSavedToServer } from "../helpers/order-helpers";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    add: (state, action) => {
      state.orders = [...state.orders, action.payload];
    },
  },
});

export const getAllOrdersFromServer = (buyerID) => async (
  dispatch,
  getState
) => {
  const token = getState().user.token;

  if (!token) {
    return { error: "401 unauthorized" };
  }

  const response = await fetchGetJSON(
    endpoints.server + endpoints.allOrdersByUser + `/${buyerID}`,
    token
  );
  if (response.error) {
    console.error(response.error);
    return;
  }

  const orders = response.result.sort((a, b) => Number(b.ID) - Number(a.ID));
  dispatch(setOrders(orders));

  return response;
};

export const saveOrderToDB = (session) => async (dispatch, getState) => {
  /**
   * 1- prepare the order to be saved to the DB
   * 2- save Order to the DB
   * 3- update user orders state
   * 4- return success
   */
  // if the transaction is successful, the user has paid for all products in cart.
  const cart = getState().compCart;
  const user = getState().user.profile;
  const token = getState().user.token;

  if (!token) {
    return { error: "401 unauthorized" };
  }

  const sessionId = session.id;
  if (!sessionId) {
    return { error: "session id is required" };
  }

  const order = prepareOrderToBeSavedToServer(cart, user, session);
  const data = {
    order: order,
    user: user,
  };
  const allOrders = await fetchGetJSON(endpoints.server + "/orders", token);

  const alreadySaved = allOrders?.result?.find(
    (e) => e?.payment_session_id === sessionId
  );

  if (alreadySaved) {
    console.error("order already saved");
    return { error: "order already saved" };
  }

  if (!cart?.count) {
    return { error: "your cart is empty, can't save empty order" };
  }

  const fetchOptions = {
    url: endpoints.server + "/orders",
    token,
    data: data,
  };

  const response = await fetchPostJSON(fetchOptions);

  await dispatch(getAllOrdersFromServer(user.ID));

  return response;
};

export const getCouponData = (couponCode) => async (dispatch, getState) => {
  const token = getState().user.token;
  
  const fetchOptions = {
    url: endpoints.server + endpoints.getCouponData,
    token,
    data: {coupon_code: couponCode},
  };

  return await fetchPostJSON(fetchOptions);
}

export const { setOrders, add } = orderSlice.actions;

export const _orders = (state) => state.order.orders;

export default orderSlice.reducer;
