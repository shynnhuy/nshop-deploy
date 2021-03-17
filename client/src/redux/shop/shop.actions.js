import { productApi, shopApi } from "api";
import { REQUEST_SHOP } from "redux/auth/auth.types";
import { enqueueSnackbar } from "redux/snackbar/snackbar.actions";
import { LOADED_SHOP, ADD_PRODUCT, UPDATE_PRODUCT } from "./shop.types";

export const createShop = (newShop) => async (dispatch) => {
  try {
    const { data } = await shopApi.createShop(newShop);
    dispatch(loadShop(data.id));
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Create shop error!",
        status: "error",
      })
    );
  }
  return "done";
};

export const loadShop = (id) => async (dispatch) => {
  try {
    const { data } = await shopApi.getShopDetails(id);
    dispatch({ type: REQUEST_SHOP, payload: true });
    dispatch({
      type: LOADED_SHOP,
      payload: data,
    });
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Load your shop error!",
        status: "error",
      })
    );
  }
};

export const createProduct = (newProduct) => async (dispatch) => {
  try {
    const { data } = await productApi.createProduct(newProduct);
    dispatch({
      type: ADD_PRODUCT,
      payload: data.result,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
    return true;
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Create product error!",
        status: "error",
      })
    );
    return false;
  }
};

export const updateProduct = (id, product) => async (dispatch) => {
  try {
    const { data } = await productApi.updateProduct(id, product);
    dispatch({
      type: UPDATE_PRODUCT,
      payload: data.result,
      id,
    });
    dispatch(enqueueSnackbar({ message: data.message, status: "success" }));
    return true;
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Update product error!",
        status: "error",
      })
    );
    return false;
  }
};
