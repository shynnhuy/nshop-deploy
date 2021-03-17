import Api, { authApi } from "api";
import { enqueueSnackbar } from "redux/snackbar/snackbar.actions";

import {
  USER_LOADED,
  USER_LOADING,
  // AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_UPDATE,
  CHECK_ADMIN,
  REQUEST_SHOP,
  UPDATE_TOKEN,
} from "./auth.types";

import { loadShop } from "redux/shop/shop.actions";

const checkAdmin = (roles = [], admin) => {
  if (roles.includes(admin)) return true;
  return false;
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    const { data } = await authApi.loadProfile();
    const { message, user } = data;
    dispatch(enqueueSnackbar({ message, status: "success" }));
    dispatch({
      type: USER_LOADED,
      payload: user,
    });
    if (user.isShopOwner) {
      dispatch(loadShop(user.shop));
    }
    if (checkAdmin(user.roles, "administrator", dispatch)) {
      dispatch({
        type: CHECK_ADMIN,
        payload: true,
      });
    }
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "You're not logged in.",
        status: "error",
      })
    );
    // dispatch({
    //   type: AUTH_ERROR,
    // });
  }
};

// Register User
export const register = (newUser) => async (dispatch) => {
  try {
    const res = await authApi.register(newUser);
    dispatch(enqueueSnackbar({ message: res.data.message, status: "success" }));
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Register Fail",
        status: "error",
      })
    );
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (userData) => async (dispatch) => {
  try {
    const { data } = await authApi.login(userData);
    const { message, ...rest } = data;

    dispatch(enqueueSnackbar({ message, status: "success" }));
    dispatch({
      type: LOGIN_SUCCESS,
      payload: rest,
    });
    if (data.user.isShopOwner) {
      dispatch(loadShop(data.user.shop));
    }
    if (checkAdmin(data.user.roles, "administrator")) {
      dispatch({
        type: CHECK_ADMIN,
        payload: true,
      });
    }
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: error.response?.data.message || "Login Fail",
        status: "error",
      })
    );
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout User
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
  });
  dispatch(
    enqueueSnackbar({
      message: "Logged out successfully",
      status: "success",
    })
  );
};

export const updateInfo = (newInfo) => (dispatch, getState) => {
  Api.patch("/auth/userData", newInfo)
    .then((res) => {
      dispatch(
        enqueueSnackbar({ message: res.data.message, status: "success" })
      );
      dispatch({
        type: USER_UPDATE,
      });
      dispatch(loadUser());
    })
    .catch((err) => {
      dispatch(
        enqueueSnackbar({
          message: err.response?.data.message || "Update Information Error",
          status: "error",
        })
      );
    });
};

export const updateToken = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_TOKEN, payload });
  dispatch(
    enqueueSnackbar({
      message: "Update token successfully",
      status: "success",
    })
  );
  // dispatch(loadUser());
};

export const requestShop = () => (dispatch) => {
  dispatch({
    type: REQUEST_SHOP,
    payload: true,
  });
};
// export const updateToken = () => (dispatch, getState) => {
//   Api.post("/auth/refreshToken", {
//     refreshToken: getState().auth.token?.refreshToken,
//   })
//     .then((res) => {
//       dispatch(
//         enqueueSnackbar({
//           message: res.data.message || "Update token successfully",
//           status: "success",
//         })
//       );
//       dispatch({
//         type: UPDATE_TOKEN,
//         payload: res.data,
//       });
//       // dispatch(loadUser());
//       setToken(res.data);
//     })
//     .catch((err) => {
//       dispatch(
//         enqueueSnackbar({
//           message: err.response?.data.message || "Update Token Error",
//           status: "error",
//         })
//       );
//     });
// };
