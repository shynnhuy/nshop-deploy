import { Badge, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

export default makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  Filter: {
    width: theme.spacing(25),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(30),
    },
  },
  list: {
    marginTop: theme.spacing(1),
  },
  badge: {
    minWidth: "30px",
    height: "30px",
    borderRadius: "50%",
  },
  Title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  TitleRight: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "100%",
    },
  },
  gridActive: {
    color: theme.palette.secondary.main,
  },
}));

export const StyledBadge = styled(Badge)`
  width: 100%;
  max-width: 100%;
`;

export const StyledCard = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 100%;
`;
export const StyledCardImage = styled.div`
  ${({ theme, image }) => `
    width: 100%;
    height: 200px;
    background-image: url(${image || ""});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    ${theme.breakpoints.down("md")} {
      height: 500px;
    }
  `}
`;
export const StyledCardTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
export const StyledCardDescription = styled.p`
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const StyledTypography = styled(Typography)`
  margin-bottom: 0px;
`;

export const StyledCardFooter = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledCardPrice = styled.div`
  display: flex;
  justify-content: ${({ product }) =>
    product.price.discount > 0 ? "space-between" : "flex-start"};
  align-items: center;
`;

export const CardFull = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 100%;
  display: flex;
`;
