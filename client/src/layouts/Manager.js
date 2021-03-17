import React, { useState, useEffect } from "react";
import { Box, CssBaseline, makeStyles } from "@material-ui/core";
import { Redirect, Route } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "components/Manager";
import { connect } from "react-redux";

import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { createStructuredSelector } from "reselect";
import {
  selectIsAuthenticated,
  selectIsAdmin,
} from "redux/auth/auth.selectors";
import { loadUsers, loadShops, loadCategories } from "redux/core/core.actions";
import {
  selectUsersList,
  selectShopsList,
  selectCategoriesList,
  selectProducts,
} from "redux/core/core.selectors";

const ManagerRoute = ({
  isAuth,
  isAdmin,
  users,
  shops,
  categories,
  products,
  loadUsers,
  loadShops,
  loadCategories,
  component: Component,
  ...rest
}) => {
  useEffect(() => {
    !users && loadUsers();
  }, [users, loadUsers]);

  useEffect(() => {
    !shops && loadShops();
  }, [shops, loadShops]);

  useEffect(() => {
    !categories && loadCategories();
  }, [categories, loadCategories]);

  if (!isAuth && !isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={(props) => (
        <ManagerLayout {...props}>
          <Component
            {...props}
            users={users}
            shops={shops}
            categories={categories}
            products={products}
          />
        </ManagerLayout>
      )}
    />
  );
};

const ManagerLayout = ({ children }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box display="flex" className={classes.layout}>
        <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
        <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.toolbar} />
            <PerfectScrollbar>
              <div className={classes.content}>{children}</div>
            </PerfectScrollbar>
          </div>
          <Footer />
        </div>
      </Box>
    </React.Fragment>
  );
};
const mapState = createStructuredSelector({
  isAuth: selectIsAuthenticated,
  isAdmin: selectIsAdmin,
  users: selectUsersList,
  shops: selectShopsList,
  categories: selectCategoriesList,
  products: selectProducts,
});
const mapDispatch = {
  loadUsers,
  loadShops,
  loadCategories,
};
export default connect(mapState, mapDispatch)(ManagerRoute);

const useStyles = makeStyles((theme) => ({
  layout: {
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    flexDirection: "column",
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    flexDirection: "column",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflowY: "scroll",
    padding: theme.spacing(3),
  },
  toolbar: {
    display: "flex",
    ...theme.mixins.toolbar,
  },
}));
