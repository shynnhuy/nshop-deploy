import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";

import useStyles, {
  StyledCard,
  StyledCardImage,
  StyledCardTitle,
  StyledCardFooter,
  StyledCardDescription,
  StyledBadge,
  StyledCardPrice,
} from "./styles";
import { Rating } from "@material-ui/lab";
import { AddShoppingCartTwoTone, StarBorderTwoTone } from "@material-ui/icons";
import { connect } from "react-redux";
import { addItem } from "redux/cart/cart.actions";
import { selectSingleCartItemQuantity } from "redux/cart/cart.selectors";
import { useHistory } from "react-router-dom";

const ProductItem = ({ product, addItem, inCart }) => {
  const classes = useStyles();
  const history = useHistory();
  const toProductDetails = () => {
    history.push("/products/" + product._id);
  };
  return (
    product && (
      <StyledBadge
        classes={{ badge: classes.badge }}
        color="secondary"
        badgeContent={inCart?.quantity}
      >
        <StyledCard>
          <div onClick={toProductDetails}>
            <StyledCardImage image={product.imageUrl}>
              {product.price.discount > 0 && (
                <span className="badge">-{product.price.discount}%</span>
              )}
            </StyledCardImage>
            <StyledCardTitle>{product.name}</StyledCardTitle>
            <StyledCardDescription>
              {product.shop?.address}
            </StyledCardDescription>
            <StyledCardPrice product={product}>
              {product.price?.discount > 0 ? (
                <span>
                  <strike>{product.price.old}đ</strike> -{" "}
                  <b
                    style={{
                      fontSize: "larger",
                    }}
                  >
                    {product.price.new}đ
                  </b>
                </span>
              ) : (
                <span>
                  <b
                    style={{
                      fontSize: "larger",
                    }}
                  >
                    {product.price.new}đ
                  </b>
                </span>
              )}
            </StyledCardPrice>
          </div>
          <StyledCardFooter>
            <Rating
              name={`${product.code}-${product._id}`}
              defaultValue={0}
              precision={0.5}
              emptyIcon={<StarBorderTwoTone className={classes.blankStar} />}
            />
            <Tooltip
              arrow
              title={`Add [${product.name}] to card`}
              placement="left"
            >
              <IconButton color="primary" onClick={() => addItem(product)}>
                <AddShoppingCartTwoTone />
              </IconButton>
            </Tooltip>
          </StyledCardFooter>
        </StyledCard>
      </StyledBadge>
    )
  );
};

// const mapState = (state, props) => ({
//   quantity: selectCartItems(state).find(
//     (item) => item._id === props.product._id
//   ).quantity,
// });
const mapState = (state, props) => ({
  inCart: selectSingleCartItemQuantity(state, props),
});

export default connect(mapState, { addItem })(ProductItem);
