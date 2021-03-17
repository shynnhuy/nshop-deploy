import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button as MatButton,
  ButtonGroup,
  useTheme,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import {
  StarBorderTwoTone as StarBlank,
  StarTwoTone as Star,
} from "@material-ui/icons";
import { ShoppingCart, Tag } from "react-feather";
import { connect } from "react-redux";
import { addItems } from "redux/cart/cart.actions";
// import { productDetailsSelector } from "redux/product/product.selectors";

import useStyles, {
  ProductName,
  ProductDescription,
  StyledButton,
  PriceContainer,
  Price,
  OldPrice,
  Discount,
} from "./styles";
import Commitments from "components/User/Commitments";
import { productApi } from "api";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import {
  StyledCard,
  StyledCardImage,
  StyledCardTitle,
} from "components/User/Content/styles";
import { useHistory } from "react-router-dom";

const ProductDetails = ({ match, addItems }) => {
  const theme = useTheme();
  const { id } = match.params;
  const [num, setNum] = useState(1);
  const [isDisable, setIsDisable] = useState(false);
  const [product, setProduct] = useState({});
  const [sameProducts, setSameProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles({ image: product.imageUrl });

  const history = useHistory();

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getProduct(id);
        setProduct(res.data);
        setIsLoading(false);
        const { data } = await productApi.getProducts({
          shop: res.data.shop._id,
        });
        setSameProducts(data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id]);
  const increase = () => setNum(num + 1);
  const decrease = () => {
    if (num === 1) {
      setIsDisable(true);
      return;
    }
    setNum(num - 1);
  };
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    product && (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item sm={12} md={5} classes={{ item: classes.ImgContainer }}>
            <div className={classes.image}></div>
          </Grid>
          <Grid item sm={12} md={7}>
            <ProductName>{product.name || "Product"} Details</ProductName>
            <Rating
              className={classes.rating}
              name={`${product.code}-${product._id}`}
              defaultValue={0}
              precision={0.5}
              icon={<Star fontSize="inherit" />}
              emptyIcon={<StarBlank fontSize="inherit" />}
            />
            <h3>
              <strong>Category:</strong> {product.category?.name}
            </h3>
            <ProductDescription>{product.description}</ProductDescription>
            <div className={classes.divider} />
            <PriceContainer>
              <Tag color={theme.palette.primary.main} />
              <Price color={theme.palette.primary.main}>
                {product.price?.new * num}đ
              </Price>
              {product.price?.discount > 0 && (
                <OldPrice>{product.price?.old}đ</OldPrice>
              )}
            </PriceContainer>
            {product.price?.discount > 0 && (
              <React.Fragment>
                <Discount color={theme.palette.secondary.main}>
                  Saved {product.price?.discount}%
                </Discount>
                <br />
              </React.Fragment>
            )}
            <ButtonGroup color="primary">
              <MatButton onClick={decrease} disabled={isDisable || num === 1}>
                <i className="fad fa-chevron-left"></i>
              </MatButton>
              <MatButton disabled>{num}</MatButton>
              <MatButton onClick={increase}>
                <i className="fad fa-chevron-right"></i>
              </MatButton>
            </ButtonGroup>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              onClick={() => addItems(product, num)}
            >
              ADD TO CART
            </StyledButton>
            <Commitments />
          </Grid>
          <Grid item sm={12}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: 12 }}
            >
              Another products of {product.shop?.name}
            </Typography>
            <Swiper spaceBetween={25} slidesPerView={5}>
              {sameProducts.map(
                (prod) =>
                  prod._id !== product._id && (
                    <SwiperSlide key={prod._id}>
                      <StyledCard>
                        <div
                          onClick={() => history.push(`/products/${prod._id}`)}
                        >
                          <StyledCardImage
                            style={{ height: "150px" }}
                            image={prod.imageUrl}
                          />
                          <StyledCardTitle>{prod.name}</StyledCardTitle>
                          {prod.price.discount > 0 ? (
                            <span>
                              <strike>{prod.price.old}đ</strike> -{" "}
                              <b
                                style={{
                                  fontSize: "larger",
                                }}
                              >
                                {prod.price.new}đ
                              </b>
                            </span>
                          ) : (
                            <span>
                              <b
                                style={{
                                  fontSize: "larger",
                                }}
                              >
                                {prod.price.new}đ
                              </b>
                            </span>
                          )}
                        </div>
                      </StyledCard>
                    </SwiperSlide>
                  )
              )}
            </Swiper>
          </Grid>
        </Grid>
      </Container>
    )
  );
};

// const mapState = (state, props) => ({
//   details: productDetailsSelector(state, props.match.params.id),
// });

const mapDispatch = {
  addItems,
};

export default connect(null, mapDispatch)(ProductDetails);
