import { createSlice } from "@reduxjs/toolkit";
import { setAppError } from "../appState/appSlice";
import errorMessages from "../appState/errorMessages";
import endpoints from "../constants/endpoints";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
import { shuffle } from "../helpers/utils";

export const categorySlice = createSlice({
  name: "competition",
  initialState: {
    categories: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const getAllCategoriesFromServer = () => (dispatch) => {
  fetch(endpoints.server + endpoints.allCategories, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  })
    .then(async (res) => {
      return res.json();
    })
    .then((cats) => {
      cats.forEach((c, i) => {
        const img = c.image;
        cats[i].image = endpoints.server + `/image/cat-id/${c.ID}/f/${img}`;
      });

      const shuffled = shuffle(cats);
      dispatch(setCategories(shuffled));
    })
    .catch((err) => {
      console.error(err);
      setAppError(err.errors, errorMessages.category.allNotFound);
    });
};

export const saveCategoryToServer = (cat) => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.allCategories,
    token: token,
    data: { name: cat.title },
  };
  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  const data = response.result;

  await uploadCategoryImage(
    data.ID,
    cat.title,
    cat.image,
    token
  );

  dispatch(getAllCategoriesFromServer());

  return response;
};

export const uploadCategoryImage = async (catID, catName, fileObj, token) => {
  const dataToSend = new FormData();
  dataToSend.append("image", fileObj);
  dataToSend.append("categoryID", catID);
  dataToSend.append("categoryName", catName);

  const res = await fetch(endpoints.server + endpoints.uploadCategoryImage, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow", // manual, *follow, error
    body: dataToSend,
  });

  let json;

  if (res) json = await res.json();

  if (json) return true;

  return false;
};

export const updateCategory = (catID, data) => async (dispatch, getState) => {
  if (!catID) {
    return { error: "Category ID is required, " };
  }
  const token = getState().user.token;
  if (!token) {
    return { error: "401 unauthorized" };
  }

  const fetchOptions = {
    url: endpoints.server + endpoints.updateCategory + "/" + catID,
    token: token,
    data: { ID: Number(catID), ...data },
  };

  const response = await fetchPostJSON(fetchOptions);

  if (response.error) {
    return response;
  }

  const r = response.result;

  await dispatch(getAllCategoriesFromServer());

  return r;
};

export const { setCategories } = categorySlice.actions;

export const _categories = (state) => state.category.categories;
export const _categoriesFetched = (state) =>
  !!state.category.categories;

export default categorySlice.reducer;
