import { coreApi } from "api/coreApi";
import { enqueueSnackbar } from "redux/snackbar/snackbar.actions";
import * as CoreTypes from "./core.types";

/* LOADING STATE */

export const loadCategories = () => async (dispatch) => {
  dispatch({
    type: CoreTypes.LOADING_CATEGORY,
  });
  try {
    const { data } = await coreApi.getCategories();
    dispatch({
      type: CoreTypes.LOADED_CATEGORY,
      payload: data,
    });
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.message || "Load categories error",
        status: "error",
      })
    );
  }
};

export const loadProducts = (category) => async (dispatch) => {
  dispatch({
    type: CoreTypes.LOADING_PRODUCT,
  });
  try {
    const params = { category };
    const { data } = await coreApi.getProducts(params);
    dispatch({
      type: CoreTypes.LOADED_PRODUCT,
      payload: data,
    });
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Load products error",
        status: "error",
      })
    );
  }
};

export const loadShops = () => async (dispatch) => {
  dispatch({
    type: CoreTypes.LOADING_SHOP,
  });
  try {
    const { data } = await coreApi.getShops();
    dispatch({
      type: CoreTypes.LOADED_SHOP,
      payload: data,
    });
    dispatch(
      enqueueSnackbar({ message: "All shops are loaded", status: "success" })
    );
  } catch (err) {
    dispatch(
      enqueueSnackbar({
        message: err.response?.data.message || "Get all shops error!",
        status: "error",
      })
    );
  }
};

export const loadUsers = () => async (dispatch) => {
  dispatch({
    type: CoreTypes.LOADING_USERS,
  });
  try {
    const { data } = await coreApi.getUsers();
    dispatch({
      type: CoreTypes.LOADED_USERS,
      payload: data,
    });
    dispatch(
      enqueueSnackbar({ message: "All users are loaded", status: "success" })
    );
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Get all users error!",
        status: "error",
      })
    );
  }
};

/* END LOADING STATE */

/* ACTIONS */

export const createCategory = (newCategory) => async (dispatch) => {
  try {
    const { data } = await coreApi.createCategory(newCategory);

    dispatch({
      type: CoreTypes.ADD_CATEGORY,
      payload: data.result,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Add category error!",
        status: "error",
      })
    );
  }
};

export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    const { data } = await coreApi.updateCategory(id, categoryData);
    dispatch({
      type: CoreTypes.UPDATED_CATEGORY,
      id,
      payload: data.result,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
    return true;
  } catch (error) {
    dispatch(
      enqueueSnackbar({ message: "Update Category Error", status: "error" })
    );
    return false;
  }
};

export const changeShopStatus = (id, status = "denied") => async (dispatch) => {
  try {
    const { data } = await coreApi.updateShopStatus(id, status);
    dispatch({
      type: CoreTypes.UPDATED_SHOP,
      id,
      payload: data.result,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Update shop status error!",
        status: "error",
      })
    );
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    const { data } = await coreApi.updateUser(id, userData);
    dispatch({
      type: CoreTypes.UPDATED_USER,
      id,
      payload: data.result,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
    return true;
  } catch (error) {
    dispatch(
      enqueueSnackbar({ message: "Update User Error", status: "error" })
    );
    return false;
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    const { data } = await coreApi.deleteUser(id);
    dispatch({
      type: CoreTypes.DELETED_USER,
      id,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
    return true;
  } catch (error) {
    dispatch(
      enqueueSnackbar({ message: "Delete User Error", status: "error" })
    );
    return false;
  }
};

export const filterProducts = (payload) => ({
  type: CoreTypes.FILTER_PRODUCTS,
  payload,
});
