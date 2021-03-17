import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router as BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import "assets/scss/App.scss";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "redux/store";

import Notifier from "components/core/Notifier";


import App from "App";
import { Slide } from "@material-ui/core";
import SThemeProvider from "context/ThemeContext";

import Loading from "components/core/Loading";

const hist = createBrowserHistory();

const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Suspense fallback={<Loading />}>
          <BrowserRouter history={hist}>
            <SThemeProvider>
              <SnackbarProvider
                maxSnack={3}
                preventDuplicate
                autoHideDuration={3000}
                TransitionComponent={Slide}
              >
                <App />
                <Notifier />
              </SnackbarProvider>
            </SThemeProvider>
          </BrowserRouter>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// Api.interceptors.request.use(function (config) {
//   const token = store.getState().auth.token;
//   config.headers["Authorization"] = `Bearer ${token}`;

//   return config;
// });
// jwt.verify(token, process.env.REACT_APP_SECRET_JWT, (err, decode) => {
//   console.log(decode, process.env.REACT_APP_SECRET_JWT);
// });
