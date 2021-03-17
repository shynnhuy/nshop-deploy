import {
  LOADED_USERS,
  ADD_CATEGORY,
  LOADED_CATEGORY,
  LOADED_SHOPS,
  UPDATED_SHOP,
  UPDATED_USER,
  UPDATED_CATEGORY,
  DELETED_USER,
} from "./admin.types";

const initialState = {
  users: [],
  categories: [],
  shops: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case LOADED_USERS:
      return {
        ...state,
        users: [...action.payload],
      };
    case LOADED_CATEGORY:
      return {
        ...state,
        categories: [...action.payload],
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, { ...action.payload }],
      };
    case LOADED_SHOPS:
      return {
        ...state,
        shops: [...action.payload],
      };
    case UPDATED_SHOP:
      return {
        ...state,
        shops: state.shops.map((shop) =>
          shop._id === action.id ? { ...action.payload } : shop
        ),
      };
    case UPDATED_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.id ? { ...action.payload } : user
        ),
      };
    case UPDATED_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category._id === action.id ? { ...action.payload } : category
        ),
      };
    case DELETED_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.id),
      };
    default:
      return state;
  }
};
