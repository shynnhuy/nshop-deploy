import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import useStyles, { StyledTypography } from "./styles";
import ProductItem from "./ProductItem";
import ProductItemFull from "./ProductItemFull";
// import { selectProducts } from "redux/product/product.selectors";
import { sortName, sortPrice, sortDiscount } from "redux/product/product.utils";

// export const Content = ({ title, products, filter, setFilter }) => {
export const Content = ({ title, products }) => {
  const classes = useStyles();
  const [grid, setGrid] = useState(true);

  const [filter, setFilter] = useState("");

  const changeFilter = (value) => {
    setFilter(value);
    let direction = value.endsWith("asc") ? "asc" : "desc";
    if (value.startsWith("price")) {
      products = sortPrice(products, direction);
    } else if (value.startsWith("name")) {
      products = sortName(products, direction);
    } else if (value.startsWith("discount")) {
      products = sortDiscount(products, direction);
    }
  };

  return (
    <Box component={Container} className={classes.root}>
      <div className={classes.Title}>
        <StyledTypography variant="h5">{title}</StyledTypography>
        <div className={classes.TitleRight}>
          <FormControl variant="outlined" className={classes.Filter}>
            <InputLabel id="sortLabel">Sort By</InputLabel>
            <Select
              label="Sort By"
              labelId="sortLabel"
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {/* <MenuItem value="created_desc">Newest</MenuItem>
            <MenuItem value="created_asc">Oldest</MenuItem> */}
              <MenuItem value="alphabet_asc">Alphabet - A-Z</MenuItem>
              <MenuItem value="alphabet_desc">Alphabet - Z-A</MenuItem>
              <MenuItem value="price_asc">Price - Lowest to Highest</MenuItem>
              <MenuItem value="price_desc">Price - Highest to Lowest</MenuItem>
              <MenuItem value="discount_asc">
                Discount - Lowest to Highest
              </MenuItem>
              <MenuItem value="discount_desc">
                Discount - Highest to Lowest
              </MenuItem>
            </Select>
          </FormControl>
          <ButtonGroup variant="outlined">
            <Button
              className={grid && classes.gridActive}
              onClick={() => setGrid(true)}
            >
              <i className="fa fa-th"></i>
            </Button>
            <Button
              className={!grid && classes.gridActive}
              onClick={() => setGrid(false)}
            >
              <i className="fad fa-th-list"></i>
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <Grid container className={classes.list} spacing={3}>
        {products.length > 0 ? (
          products.map((product) =>
            grid ? (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductItem isGrid={grid} product={product} />
              </Grid>
            ) : (
              <Grid item xs={12} key={product._id}>
                <ProductItemFull isGrid={grid} product={product} />
              </Grid>
            )
          )
        ) : (
          <div className="empty-div">
            <i className="fad fa-folder-open fa-10x empty-cate"></i>
            <Typography variant="h4">Category is empty</Typography>
          </div>
        )}
      </Grid>
    </Box>
  );
};

export default Content;
