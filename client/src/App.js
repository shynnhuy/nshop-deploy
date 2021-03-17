import React, { lazy, useCallback, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import UserRoute from "layouts/User";
import AuthRoute from "layouts/Auth";
import NotFound from "layouts/NotFound";
import ManagerRoute from "layouts/Manager";

import { connect } from "react-redux";
import { loadUser, logout, updateToken } from "redux/auth/auth.actions";
// import { getCategories } from "redux/shop/shop.actions";
import { loadCategories } from "redux/core/core.actions";
import api, { authApi } from "api";
import { getExpirationDate, isExpired } from "redux/auth/auth.helper";

// User
const Landing = lazy(() => import("views/User/Landing"));
const Profile = lazy(() => import("views/User/Profile"));
const Home = lazy(() => import("views/User/Home"));
const Shop = lazy(() => import("views/User/Shop"));
const Cart = lazy(() => import("views/User/Cart"));
const ProductDetails = lazy(() => import("views/User/ProductDetails"));

// Admin
const Dashboard = lazy(() => import("views/Admin/Dashboard"));
const ListCategory = lazy(() => import("views/Admin/ListCategory"));
const ListShops = lazy(() => import("views/Admin/ListShops"));
const ListUsers = lazy(() => import("views/Admin/ListUsers"));

const Login = lazy(() => import("views/Auth/Login"));
const Register = lazy(() => import("views/Auth/Register"));

const App = ({ token, loadUser, logout, updateToken, loadCategories }) => {
  const location = useLocation();

  const memoLoadUser = useCallback(() => loadUser(), [loadUser]);
  // const memoGetCategories = useCallback(() => getCategories(), [getCategories]);

  useEffect(() => {
    if (token) {
      memoLoadUser();
    }
  }, [token, memoLoadUser]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  api.interceptors.request.use((config) => {
    const storeToken = token || JSON.parse(localStorage.getItem("token"));
    if (!config.headers.Authorization) {
      config.headers.Authorization = storeToken
        ? `Bearer ${storeToken.accessToken}`
        : "";
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      if (status !== 401) {
        return Promise.reject(error);
      }

      if (config.url === "/auth/refreshToken") {
        logout();
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      if (token && isExpired(getExpirationDate(token.accessToken))) {
        authApi
          .refreshToken(token.refreshToken)
          .then((res) => {
            updateToken(res.data);
            config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;

            return new Promise((resolve, reject) => {
              api
                .request(originalRequest)
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
      return Promise.reject(error);
    }
  );

  return (
    <Switch location={location}>
      <UserRoute path="/" exact noSearch component={Landing} />
      <UserRoute path="/home" component={Home} />
      <UserRoute path="/profile" auth component={Profile} />
      <UserRoute path="/myshop" auth component={Shop} />
      <UserRoute path="/cart" component={Cart} />
      <UserRoute path="/products/:id" component={ProductDetails} />
      <AuthRoute path="/login" component={Login} />
      <AuthRoute path="/register" component={Register} />
      <Redirect path="/admin" exact to="/admin/dashboard" />
      <ManagerRoute path="/admin/dashboard" component={Dashboard} />
      <ManagerRoute path="/admin/users" component={ListUsers} />
      <ManagerRoute path="/admin/categories" component={ListCategory} />
      <ManagerRoute path="/admin/shops" component={ListShops} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

const mapState = (state) => ({
  token: state.auth.token,
});

const mapDispatch = {
  loadUser,
  logout,
  updateToken,
  loadCategories,
};

export default connect(mapState, mapDispatch)(App);
