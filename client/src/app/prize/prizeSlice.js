import { createSlice } from "@reduxjs/toolkit";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
import endpoints from "../constants/endpoints";

export const prizeSlice = createSlice({
    name: "prize",
    initialState: {
        prizes: [],
    },
    reducers: {
        setPrizes: (state, action) => {
            state.prizes = action.payload;
        },
    },
});

export const { setPrizes } = prizeSlice.actions;

export const getAllPrizesFromServer = () => async (dispatch, getState) => {
    const token = getState().user.token;
    if (!token) {
        return { error: "401 unauthorized" };
    }

    const response = await fetchGetJSON(endpoints.server + endpoints.allPrizes, token);

    if (response.error) {
        return response;
    }

    const data = response.result;

    dispatch(setPrizes(data));

    return response;
}



export const createNewPrize = (prizeData) => async (dispatch, getState) => {
    const token = getState().user.token;
    if (!token) {
        return { error: "401 unauthorized" };
    }

    const fetchOptions = {
        url: endpoints.server + endpoints.allPrizes,
        token,
        data: prizeData,
    }

    const response = await fetchPostJSON(fetchOptions);

    if (response.error) {
        return response;
    }

    dispatch(getAllPrizesFromServer());

    return response;
}


export const updatePrize = (prizeData) => async (dispatch, getState) => {
    const token = getState().user.token;
    if (!token) {
        return { error: "401 unauthorized" };
    }

    if (!prizeData.ID) {
        return { error: "prize ID is required," };
    }

    const fetchOptions = {
        url: endpoints.server + endpoints.updatePrize(prizeData.ID),
        token,
        data: prizeData,
    }

    const response = await fetchPostJSON(fetchOptions);

    if (response.error) {
        return response;
    }

    dispatch(getAllPrizesFromServer());

    return response;
}


export const _prizes = (state) => state.prize.prizes;


export default prizeSlice.reducer;
