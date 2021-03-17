import {
  LOADING_PRODUCTS,
  LOADED_PRODUCTS,
  FILTER_PRODUCTS,
  LOAD_ERROR,
} from "./product.types";

const defaultState = {
  isLoadProducts: false,
  products: [],
  filteredProducts: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOADING_PRODUCTS:
      return {
        ...state,
        isLoadProducts: true,
        products: [],
      };
    case LOADED_PRODUCTS:
      return {
        ...state,
        isLoadProducts: false,
        products: [...action.payload],
        filteredProducts: [...action.payload],
      };
    case LOAD_ERROR:
      return {
        ...state,
        isLoadProducts: false,
        products: [],
        filteredProducts: [],
      };
    case FILTER_PRODUCTS:
      let value = action.payload.value;
      let filteredProducts = state.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(value) ||
          product.shop.name.toLowerCase().includes(value)
        );
      });

      if (value) {
        return {
          ...state,
          filteredProducts,
        };
      } else {
        return {
          ...state,
          filteredProducts: state.products,
        };
      }
    default:
      return state;
  }
};

// function sortAsc(arr, field) {
//   return arr.sort(function (a, b) {
//     if (a[field] > b[field]) return 1;

//     if (b[field] > a[field]) return -1;

//     return 0;
//   });
// }

// function sortDesc(arr, field) {
//   return arr.sort(function (a, b) {
//     if (a[field] > b[field]) return -1;

//     if (b[field] > a[field]) return 1;

//     return 0;
//   });
// }
