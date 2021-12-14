import { createSlice } from "@reduxjs/toolkit";
import endpoints from "../constants/endpoints";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const getAllMessagesFromServer = (userId) => async (dispatch) => {
  const res = await fetchGetJSON(endpoints.server + endpoints.allMessages + '/' + userId);

  if (res.error) {
    console.error(res.error);
    return res;
  }

  const messages = res.result.sort((a, b) => b.ID - a.ID);

  if (messages) {
    dispatch(setMessages(messages));
  }

  return res;
};

export const saveMessageToServer = (msg) => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.allMessages,
    token,
    data: {
      ...msg,
    },
  };
  const res = await fetchPostJSON(fetchOptions);
  return res;
};
export const { setMessages } = messageSlice.actions;

export const _messages = (state) => state.message.messages;

export default messageSlice.reducer;
