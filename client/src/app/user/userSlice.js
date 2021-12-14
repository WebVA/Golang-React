import { createSlice } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "../appState/appSlice";
import endpoints from "../constants/endpoints";
import { fetchPostJSON, fetchGetJSON } from "../helpers/api-helpers";
import {
  defaultAddress,
  defaultNotificationSettings,
} from "../helpers/default-types";
import { clearCompCart } from "../compCart/cartSlice";

const initialProfile = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialToken = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialUserId = localStorage.getItem("userId")
  ? localStorage.getItem("userId")
  : null;

const saveToStorage = (profile) => {
  delete profile.role;
  delete profile.password;
  window.localStorage.setItem("user", JSON.stringify(profile));
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: initialUserId,
    profile: initialProfile,
    token: initialToken,
    isAdmin: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.profile = { ...action.payload.user };
      state.token = action.payload.token;
      state.userId = action.payload.user.ID;
    },
    logout: (state, action) => {
      state.profile = {};
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      state.isAdmin = null;
    },
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      saveToStorage(state.profile);
    },
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    updateProfileRewardPoints: (state, action) => {
      state.profile.reward_points = action.payload;
      saveToStorage(state.profile);
    }
  },
});

export const {
  loginUser,
  logout,
  setAdmin,
  setUserProfile,
  updateProfileRewardPoints
} = userSlice.actions;

export const login = (email, password) => async (dispatch) => {
  const fetchOptions = {
    url: endpoints.server + endpoints.login,
    data: {
      email: email,
      password: password,
    },
  };

  const response = await fetchPostJSON(fetchOptions);

  const loginResponse = response.result;

  if (loginResponse) {
    dispatch(
      loginUser({
        user: loginResponse.user,
        token: loginResponse.token,
      })
    );

    if (loginResponse.user.role === "admin") {
      dispatch(setAdmin(true));
    }

    window.localStorage.setItem(
      "user",
      JSON.stringify({ ...loginResponse.user })
    );
    window.localStorage.setItem("token", loginResponse.token);
    window.localStorage.setItem("userId", loginResponse.user.ID);
  }
  return response;
};

export const signupUser = (formState) => async (dispatch) => {
  const dataToSend = {
    address: defaultAddress,
    notification_settings: defaultNotificationSettings,
    email: formState.email,
    password: formState.password,
    first_name: formState.name.split(" ")[0],
    last_name: formState.name.split(" ")[1] || "",
    username: formState.name,
  };

  const fetchOptions = {
    url: endpoints.server + endpoints.signup,
    data: dataToSend,
  };
  const response = await fetchPostJSON(fetchOptions);

  const loginResponse = response.result;

  if (loginResponse) {
    dispatch(
      loginUser({
        user: loginResponse.user,
        token: loginResponse.token,
      })
    );

    window.localStorage.setItem(
      "user",
      JSON.stringify({ ...loginResponse.user })
    );
    window.localStorage.setItem("token", loginResponse.token);
  }
  return response;
};

export const logoutUser = () => (dispatch) => {
  dispatch(clearCompCart());
  dispatch(logout());
};
export const UpdateUser = (id, user) => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateUser + id,
    token,
    data: user,
  };
  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  dispatch(setUserProfile(response.result));

  return response;
};

export const updateUserAddress = (addressID, address) => async (
  dispatch,
  getState
) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateAddress + addressID,
    token,
    data: address,
  };
  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  return response;
};

export const updateUserNotificationSettings = (nsID, nsObj) => async (
  dispatch,
  getState
) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateNotificationSettings + nsID,
    token,
    data: nsObj,
  };
  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  await dispatch(fetchUserInfo());
  return response;
};
export const checkToken = () => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) return;
  const fetchOptions = {
    url: endpoints.server + endpoints.checkUserToken,
    token: token,
  };

  const res = await fetchPostJSON(fetchOptions);

  // if token is not valid, silently log out the user.
  if (res.error) {
    dispatch(logoutUser());
  }

  return res;
};

export const fetchUserInfo = () => async (dispatch, getState) => {
  const token = getState().user?.token;
  const id = getState().user?.userId;
  if (!token || !id) return;

  const response = await fetchGetJSON(
    endpoints.server + endpoints.updateUser + id,
    token
  );

  if (response.error) {
    return response;
  }

  dispatch(setUserProfile(response.result));
  return response;
};

export const checkAdminToken = () => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) return;
  const fetchOptions = {
    url: endpoints.server + endpoints.checkAdminToken,
    token: token,
  };

  const res = await fetchPostJSON(fetchOptions);

  // if token is not valid, silently log out the user.
  if (res.error) {
    dispatch(setAdmin(false));
  } else {
    const msg = res.result;
    if (msg.msg && msg.description) {
      dispatch(setAdmin(true));
    }
  }

  return res;
};

export const verifyUserAccount = (token) => async (dispatch) => {
  const url = endpoints.server + endpoints.verifyEmail + token;
  const res = await fetchGetJSON(url);
  return res;
};

export const subscribeToNewsLetter = (email) => async (dispatch) => {
  const fetchOptions = {
    url: endpoints.server + endpoints.subscribeToNewsLetter,
    data: { email: email },
  };
  const res = await fetchPostJSON(fetchOptions);

  return res;
};

export const userResendEmailVerification = () => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const user = getState().user.profile;

  const fetchOptions = {
    url: endpoints.server + endpoints.resendEmailVerification,
    token,
    data: user,
  };
  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  return response;
};


export const UpdateRewardPointsToUserAccount = (points) => async (dispatch, getState) => {
  const token = getState().user.token;
  const user = getState().user.profile;
  if (!token) return;
  const fetchOptions = {
    url: endpoints.server + endpoints.updateRewardPoints,
    data: { ID: user.ID, reward_points: points },
    token: token,
  };

  const r = await fetchPostJSON(fetchOptions);

  if (!r.error) { dispatch(updateProfileRewardPoints(points)) }

  return r;

}

export const createStripeCoupon = (prize) => async (dispatch, getState) => {
  const token = getState().user.token;
  const user = getState().user.profile;
  if (!token) return;
  const fetchOptions = {
    url: endpoints.server + endpoints.createCoupon,
    data: { ...prize, user },
    token: token,
  };

  const r = await fetchPostJSON(fetchOptions);

  return r;

}

export const _profile = (state) => state.user.profile;
export const _loggedIn = (state) => (state.user.profile?.ID ? true : false);
export const _token = (state) => state.user.token;
export const _isAdmin = (state) => state.user.isAdmin;
export const _userError = (state) => state.user.userError;
export const _accountActivated = (state) =>
  state.user.profile?.email_verified ? true : false;
export const _userFetched = (state) => state.user.profile?.ID;
export const _userRewardPoints = (state) => state.user.profile?.reward_points;
export default userSlice.reducer;
