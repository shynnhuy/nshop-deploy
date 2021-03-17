import { Button, makeStyles } from "@material-ui/core";
import styled from "styled-components";

export default makeStyles((theme) => ({
  ImgContainer: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
    },
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundImage: (props) => `url(${props.image})`,
    backgroundPosition: "top",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  rating: {
    fontSize: "2em",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    margin: theme.spacing(2, 0, 3),
  },
}));

export const ProductName = styled.h2`
  font-size: 2em;
  font-weight: 600;
  margin: 0;
`;

export const ProductDescription = styled.p`
  margin: 0;
`;

export const StyledButton = styled(Button)`
  display: flex;
  margin: 12px 0 7px 0;
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
export const Price = styled.p`
  margin: 0 8px;
  /* margin-left: 6px; */
  font-size: 19px;
  color: ${(props) => props.color};
`;
export const OldPrice = styled.p`
  margin: 0;
  margin-left: 2px;
  color: #8a8a8a;
  text-decoration: line-through;
  font-size: 17px;
`;

export const Discount = styled.div`
  background: ${(props) => props.color};
  padding: 6px 20px;
  border-radius: 40px;
  font-size: 17px;
  display: inline-block;
  margin-bottom: 12px;
`;
