import * as AdminTypes from "./admin.types";
import Api, { adminApi } from "api";
import { enqueueSnackbar } from "redux/snackbar/snackbar.actions";

export const getAllUsers = () => async (dispatch) => {
  try {
    const { data } = await adminApi.getUsers();
    dispatch({
      type: AdminTypes.LOADED_USERS,
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

export const getCategories = () => (dispatch) => {
  Api.get("/products/category")
    .then((res) => {
      dispatch({
        type: AdminTypes.LOADED_CATEGORY,
        payload: res.data,
      });
      dispatch(
        enqueueSnackbar({
          message: "All categories are loaded",
          status: "success",
        })
      );
    })
    .catch((err) => {
      dispatch(
        enqueueSnackbar({
          message: err.response?.data.message || "Get all categories error!",
          status: "error",
        })
      );
    });
};
export const getShops = () => async (dispatch) => {
  try {
    const res = await adminApi.getShops();
    dispatch({
      type: AdminTypes.LOADED_SHOPS,
      payload: res.data,
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

export const addCategory = (newCategory) => (dispatch) => {
  Api.post("/products/createCategory", newCategory)
    .then((res) => {
      dispatch({
        type: AdminTypes.ADD_CATEGORY,
        payload: res.data.result,
      });
      dispatch(
        enqueueSnackbar({ message: res.data.message, status: "success" })
      );
    })
    .catch((err) => {
      dispatch(
        enqueueSnackbar({
          message: err.response?.data.message || "Add category error!",
          status: "error",
        })
      );
    });
};

export const changeShopStatus = (id, status = "denied") => async (dispatch) => {
  try {
    const { data } = await adminApi.updateShopStatus(id, status);
    dispatch({
      type: AdminTypes.UPDATED_SHOP,
      id,
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

export const updateUserData = (id, userData) => async (dispatch) => {
  try {
    const { data } = await adminApi.updateUser(id, userData);
    dispatch({
      type: AdminTypes.UPDATED_USER,
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

export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    const { data } = await adminApi.updateCategory(id, categoryData);
    dispatch({
      type: AdminTypes.UPDATED_CATEGORY,
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

export const deleteUser = (id) => async (dispatch) => {
  try {
    const { data } = await adminApi.deleteUser(id);
    dispatch({
      type: AdminTypes.DELETED_USER,
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
