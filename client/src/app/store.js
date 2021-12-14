import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import appStateReducer from "./appState/appSlice";
import competitionReducer from "./competition/competitionSlice";
import categoryReducer from "./competition/categorySlice";
import { reduxBatch } from "@manaflair/redux-batch";
import orderReducer from "./order/orderSlice";
import ticketReducer from "./ticket/ticketSlice";
import compCartReducer from "./compCart/cartSlice";
import messageReducer from "./message/messageSlice";
import adminReducer from "./admin/adminSlice";
import logger from "redux-logger";
import prizeReducer from "./prize/prizeSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    appState: appStateReducer,
    competition: competitionReducer,
    category: categoryReducer,
    order: orderReducer,
    ticket: ticketReducer,
    compCart: compCartReducer,
    message: messageReducer,
    admin: adminReducer,
    prize: prizeReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  enhancers: [reduxBatch],
});
