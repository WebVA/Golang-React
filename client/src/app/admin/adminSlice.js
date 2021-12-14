import { createSlice } from "@reduxjs/toolkit";
import { fetchGetJSON } from "../helpers/api-helpers";
import endpoints from "../constants/endpoints";

export const appSlice = createSlice({
  name: "admin",
  initialState: {
    winnerInfo: {},
  },
  reducers: {
    setWinner: (state, action) => {
      state.winnerInfo = { ...action.payload };
    },
  },
});

export const { setWinner } = appSlice.actions;

export const _winnerInfo = (state) => state.admin.winnerInfo;

export const fetchWinnerInfo = (winnerID) => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const response = await fetchGetJSON(
    endpoints.server + endpoints.getUserByID + "/" + winnerID,
    token
  );

  if (response.error) {
    return response;
  }

  const r = response.result;

  dispatch(setWinner({...r}));
  return response;
};

export default appSlice.reducer;
