import { createSelector } from "reselect";

const selectProductSelector = (state) => state.product;

export const selectProducts = createSelector(
  [selectProductSelector],
  (product) => product.filteredProducts
);

const selectProduct = (state, id) =>
  state.product.products.find((product) => product._id === id);

export const productDetailsSelector = createSelector(
  [selectProduct],
  (details) => details
);

export const selectProductCategory = createSelector(
  (state, props) =>
    state.core.categories.find((item) => item._id === props.product.category),
  (item) => item.name
);
