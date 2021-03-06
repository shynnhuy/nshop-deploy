import React, { useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Zoom,
  Badge,
  Hidden,
  Paper,
  Divider,
  InputBase,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Fade,
} from "@material-ui/core";
import useStyles from "./styles";
// import SearchBar from "material-ui-search-bar";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "redux/auth/auth.actions";
import { useThemeContext } from "context/ThemeContext";

import SIcon from "components/core/SIcon";
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "redux/cart/cart.selectors";

import { DehazeTwoTone, Directions } from "@material-ui/icons";
import { ShoppingCart as CartIc } from "react-feather";
// import ShynnMap from "components/core/ShynnMap";
import {
  usePopupState,
  bindTrigger,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";
import Popover from "material-ui-popup-state/HoverPopover";
import ShynnMap from "components/core/ShynnMap";
import useModal from "hooks/useModal";

export const Navbar = ({
  auth,
  shop,
  logout,
  cartCount,
  cartItems,
  cartTotal,
  toggleSidebar,
  noSearch,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [profileMenu, setProfileMenu] = useState(null);
  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const handleClick = (event) => setProfileMenu(event.currentTarget);

  const handleClose = () => setProfileMenu(null);

  const onLogout = () => {
    logout();
    handleClose();
  };
  const toHome = () => history.push("/");
  const toAdmin = () => history.push("/admin/dashboard");
  const toLogin = () => history.push("/login");
  const toShop = () => history.push("/myshop");
  const toCart = () => history.push("/cart");
  const toProfile = () => {
    history.push("/profile");
    handleClose();
  };

  const { darkState, handleThemeChange } = useThemeContext();
  const ToggleIcon = ({ title, icon }) => (
    <Tooltip title={title} placement="left" arrow TransitionComponent={Zoom}>
      <IconButton onClick={() => handleThemeChange()}>
        <SIcon className={icon} />
      </IconButton>
    </Tooltip>
  );

  const renderToggle = () =>
    darkState ? (
      <ToggleIcon title="Toogle Light Theme" icon="fa-sun" />
    ) : (
      <ToggleIcon title="Toogle Dark Theme" icon="fa-eclipse-alt" />
    );

  const [userPlace, setUserPlace] = useState("");
  const { handleModal } = useModal();

  return (
    <Box component={Container} maxWidth="lg" className={classes.Navbar}>
      <Box md={2} className={classes.Left}>
        <Button onClick={toHome} color="inherit">
          <Typography
            className={classes.title}
            variant="h5"
            align="center"
            noWrap
          >
            <i className="fad fa-home mr-2"></i>
            NnyhS
          </Typography>
          {/* NnyhS */}
        </Button>
      </Box>

      {noSearch ? (
        <div className={classes.grow}></div>
      ) : (
        <Box className={classes.Center}>
          <Paper className={classes.searchBar}>
            <InputBase
              className={classes.input}
              placeholder="Choose Your Location"
              inputProps={{ "aria-label": "search google maps" }}
              value={userPlace}
              onChange={(e) => setUserPlace(e.target.value)}
              disabled
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              color="primary"
              className={classes.iconButton}
              aria-label="directions"
              onClick={() => handleModal(<ShynnMap place={userPlace} />)}
            >
              <Directions />
            </IconButton>
          </Paper>
        </Box>
      )}
      <div className={classes.Right}>
        {renderToggle()}
        {auth.isAuthenticated ? (
          <IconButton onClick={handleClick}>
            <i className="fad fa-user"></i>
          </IconButton>
        ) : (
          <IconButton onClick={toLogin}>
            <i className="fad fa-user"></i>
          </IconButton>
        )}
        {auth.isRequestShop && shop.status === "approval" && (
          <IconButton onClick={toShop}>
            <i className="fad fa-store"></i>
          </IconButton>
        )}
        <IconButton
          {...bindTrigger(popupState)}
          {...bindHover(popupState)}
          component="span"
        >
          <Badge badgeContent={cartCount} color="secondary" showZero>
            <i className="fad fa-shopping-cart"></i>
          </Badge>
        </IconButton>
        <Popover
          PaperProps={{ className: classes.popover }}
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={Fade}
        >
          <CartPreview
            classes={classes}
            total={cartTotal}
            items={cartItems}
            toCart={toCart}
          />
        </Popover>
        <Menu
          id="simple-menu"
          anchorEl={profileMenu}
          keepMounted
          open={Boolean(profileMenu)}
          onClose={handleClose}
        >
          {auth.isAdmin && <MenuItem onClick={toAdmin}>Admin</MenuItem>}
          <MenuItem onClick={toProfile}>Profile</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <Hidden smUp>
        <IconButton onClick={toggleSidebar(true)}>
          <DehazeTwoTone />
        </IconButton>
      </Hidden>
    </Box>
  );
};

const CartPreview = ({ classes, items, total, toCart }) => {
  return (
    <Card className={classes.preview}>
      <CardContent>
        <List>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <ListItem className={classes.previewItem} key={idx}>
                <ListItemText>
                  {item.name} x {item.quantity}
                </ListItemText>
                <Typography>{item.price.new * item.quantity}??</Typography>
              </ListItem>
            ))
          ) : (
            <ListItem style={{ textAlign: "center" }}>
              <ListItemText>
                No thing in your cart
                <div>
                  <NavLink to="/home">Go to shopping</NavLink>
                </div>
              </ListItemText>
            </ListItem>
          )}
          <ListItem className={classes.previewItemBottom}>
            <Typography variant="h5">Total: {total}??</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={toCart}
              startIcon={<CartIc />}
            >
              Go To Cart
            </Button>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

const mapState = (state) => ({
  auth: state.auth,
  shop: state.shop,
  cartCount: selectCartItemsCount(state),
  cartItems: selectCartItems(state),
  cartTotal: selectCartTotal(state),
});

const mapDispatch = {
  logout,
};

export default connect(mapState, mapDispatch)(Navbar);
