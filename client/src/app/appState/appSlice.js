import { createSlice } from "@reduxjs/toolkit";
import {fetchGetJSON, fetchPostJSON} from "../helpers/api-helpers";
import endpoints from "../constants/endpoints";

export const appSlice = createSlice({
  name: "appState",
  initialState: {
    error: {
      err: null,
      message: null,
    },
    loading: false,
    success:null,
    options: {},
  },
  reducers: {
    setError: (state, action) => {
      state.error = { ...action.payload };
    },
    clearError: (state, action) => {
      state.error = { err: null, message: null };
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state, action) => {
      state.success = null;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setOptions: (state, action) => {
      state.options = action.payload;
    }
  },
});

export const {
  setError,
  clearError,
  startLoading,
  stopLoading,
  setSuccess,
  clearSuccess,
  setOptions
} = appSlice.actions;

export const _appError = (state) => state.appState.error.message;
export const _loading = (state) => state.appState.loading;
export const _appSuccess = (state) => state.appState.success;
export const _appOptions = (state) => state.appState.options;

export const getAppOptions = () => async (dispatch) => {
  const res = await fetchGetJSON(endpoints.server + endpoints.getAppOptions);

  if(res.error) return;

  const optionsArr = res.result;

  const optionsObj = {};

  optionsArr.forEach(o => {
    optionsObj[o.key]= o.value; 
  })

  dispatch(setOptions(optionsObj));
}

export const addAppOption = (key , value) => async(dispatch, getState) => {

  if(!key || !value) return {error: "Key and value both required"};

  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.addAppOptions,
    token: token,
    data: {key, value},
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }


  dispatch(getAppOptions());

  return response;


}

export const updateAppOption = (key , value) => async(dispatch, getState) => {

  if(!key || !value) return {error: "Key and value both required"};

  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateAppOptions,
    token: token,
    data: {key, value},
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }


  dispatch(getAppOptions());

  return response;


} 

export const setAppError = (err, message) => (dispatch) => {
  dispatch(setError({ err, message }));
};

export const clearAppError = () => (dispatch) => {
  dispatch(clearError());
};

export const setAppSuccess = (msg) => (dispatch) =>{
  dispatch(setSuccess(msg));
}

export const clearAppSuccess = () => (dispatch) => {
  dispatch(clearSuccess());
}
export default appSlice.reducer;
