import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_UPDATE,
  CHECK_ADMIN,
  UPDATE_TOKEN,
  REQUEST_SHOP,
} from "./auth.types";

const initialState = {
  // token: JSON.parse(sessionStorage.getItem('token') || '') || null,
  token: null,
  isAuthenticated: null,
  isAdmin: false,
  isLoading: false,
  user: null,
  roles: {},
  isRequestShop: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      const { isRequestShop, isShopOwner, ...user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user,
        isRequestShop,
        isShopOwner,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAdmin: false,
        isAuthenticated: false,
        isLoading: false,
        isRequestShop: false,
        isShopOwner: false,
      };
    case USER_UPDATE: {
      return {
        ...state,
      };
    }
    case CHECK_ADMIN: {
      return {
        ...state,
        isAdmin: action.payload,
      };
    }
    case UPDATE_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }
    case REQUEST_SHOP: {
      return {
        ...state,
        user: { ...state.user, isRequestShop: action.payload },
        isRequestShop: action.payload,
      };
    }
    default:
      return state;
  }
}
