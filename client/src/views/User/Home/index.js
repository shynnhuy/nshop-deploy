import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { Swiper } from "components/User";
import Content from "components/User/Content";
import { connect } from "react-redux";

// import { getProducts, filterProducts } from "redux/product/product.actions";
// import ShynnMap from "components/core/ShynnMap";

import SearchBar from "material-ui-search-bar";
import { debounce } from "lodash";
import { selectProducts } from "redux/core/core.selectors";
import { loadProducts, filterProducts } from "redux/core/core.actions";

export const Home = ({ core, products, loadProducts, filterProducts }) => {
  const [category, setCategory] = useState("all");
  const [categoryName, setCategoryName] = useState("All Products");

  // useEffect(() => {
  //   const onSuccess = ({ coords }) => {
  //     panTo({ lat: coords.latitude, lng: coords.longitude });
  //   };
  //   const onLocate = () => {
  //     navigator.geolocation.getCurrentPosition(onSuccess, () => null);
  //   };
  // }, []);
  useEffect(() => {
    loadProducts(category);
  }, [loadProducts, category]);

  const changeCategory = (id, name) => {
    setCategory(id);
    setCategoryName(name);
  };

  const onChangeSearch = (value) => debouncedSearch(value);
  const debouncedSearch = debounce(function (value) {
    filterProducts({ value });
  }, 1000);

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <SearchBar
          cancelOnEscape
          onChange={onChangeSearch}
          onRequestSearch={(value) => filterProducts({ value })}
          onCancelSearch={() => filterProducts({ value: "" })}
          placeholder={"Search for foods, drinks or shop..."}
          inputProps={{ "aria-label": "search" }}
        />
        <Swiper categories={core.categories} changeCategory={changeCategory} />
      </Container>
      <Content title={categoryName} products={products} />
      {/* <ShynnMap /> */}
    </React.Fragment>
  );
};

const mapState = (state) => ({
  core: state.core,
  products: selectProducts(state),
});

export default connect(mapState, {
  filterProducts,
  loadProducts,
})(Home);
