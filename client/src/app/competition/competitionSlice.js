import { createSlice } from "@reduxjs/toolkit";
import { setAppError } from "../appState/appSlice";
import errorMessages from "../appState/errorMessages";
import endpoints, {
  prepareCompetitionImagesUrlsArray,
  prepareCompetitionFeaturedImage,
} from "../constants/endpoints";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
import {
  findTrendingCompetitions,
  findFeaturedCompetitions,
} from "../helpers/competitions-algorithms";
import { getAllCategoriesFromServer } from "./categorySlice";

export const competitionSlice = createSlice({
  name: "competition",
  initialState: {
    competitions: null,
    trending: [],
    featured: [],
  },
  reducers: {
    setCompetitions: (state, action) => {
      state.competitions = action.payload;
    },
    append: (state, action) => {
      state.competitions.push(action);
    },
    updateSingle: (state, action) => {
      for (let i in state.competitions) {
        if (state.competitions[i].ID === action.payload.ID) {
          state.competitions[i] = { ...action.payload };
          return;
        }
      }
    },
    setTrending: (state, action) => {
      state.trending = action.payload;
    },
    setFeatured: (state, action) => {
      state.featured = action.payload;
    },
  },
});

export const {
  setCompetitions,
  append,
  updateSingle,
  setTrending,
  setFeatured,
} = competitionSlice.actions;

export const getAllCompetitionsFromServer = () => async (dispatch) => {

  const response = await fetchGetJSON(
    endpoints.server + endpoints.allCompetitions
  );

  if (response.error) {
    return response;
  }

  const comps = response.result;

  comps.forEach((comp, i) => {
    const imagesArrays = prepareCompetitionImagesUrlsArray(comp);
    comps[i].images = imagesArrays;
    comps[i].price = comp.price.toFixed(2);
    if (comp.reduced_price) {
      comps[i].reduced_price = comp.reduced_price.toFixed(2);
    }
    let featuredImageUrl;
    if (comps.featured_image && comp.featured_image !== " ") {
      featuredImageUrl = prepareCompetitionFeaturedImage(comp);
    } else {
      featuredImageUrl = imagesArrays[0];
    }
    comps[i].featured_image = featuredImageUrl;
  });

  const trendingComps = findTrendingCompetitions(comps);
  const featuredComps = findFeaturedCompetitions(comps);

  const sorted = comps.sort((a, b) => b.ID - a.ID);

  dispatch(setTrending(trendingComps));
  dispatch(setFeatured(featuredComps));
  dispatch(setCompetitions(sorted));

  return response;
};

export const saveCompetitionToServer = (req) => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.allCompetitions,
    token: token,
    data: req.competition,
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  const data = response.result;

  const psArray = [];
  req.images.forEach((image, i) => {
    psArray.push(uploadCompetitionImage(data.ID, data.title, image, token, i));
  });

  return Promise.all(psArray).then((res) => {
    dispatch(append(data));
    dispatch(getAllCompetitionsFromServer());
    return response;
  });
};

export const uploadCompetitionImage = (cid, cName, fileObj, token, index) => {
  const dataToSend = new FormData();
  dataToSend.append("image", fileObj);
  dataToSend.append("competitionID", cid);
  dataToSend.append("competitionName", cName);
  dataToSend.append("index", index);

  return fetch(endpoints.server + endpoints.uploadCompetitionImage, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow", // manual, *follow, error
    body: dataToSend,
  })
    .then(async (response) => {
      return response.json();
    })
    .catch((err) => {
      console.error(err);
      setAppError(err.errors, errorMessages.competition.allNotFound);
      return err;
    });
};

export const updateCompetition = (compID, data) => async (
  dispatch,
  getState
) => {
  if (!compID) {
    return { error: "competition ID is required, " };
  }
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateCompetition + "/" + compID,
    token: token,
    data: { ID: Number(compID), ...data },
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  const r = response.result;

  await dispatch(getAllCompetitionsFromServer());

  return r;
};

export const updateQuiz = (quizID, data) => async (dispatch, getState) => {
  if (!quizID || !data.ID) {
    return { error: "Quiz ID is required, " };
  }
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateQuiz + "/" + quizID,
    token: token,
    data: data,
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  const r = response.result;

  dispatch(getAllCompetitionsFromServer());

  return r;
};

export const getCompetitionById = (id) => (dispatch, getState) => {
  const competitions = getState().competition.competitions;
  return competitions?.find((comp) => Number(comp.ID) === Number(id));
};

export const _competitions = (state) => state.competition.competitions;
export const _competitionsFetched = (state) =>
  !!state.competition.competitions;

export const _trendingCompetitions = (state) => state.competition.trending;
export const _featuredCompetitions = (state) => state.competition.featured;

// default export
export default competitionSlice.reducer;
