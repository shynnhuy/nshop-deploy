import React, { createContext, useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { deepOrange, pink, blue, red } from "@material-ui/core/colors";
import SocketProvider from "./SocketContext";
import "assets/scss/fonts/_index.scss";
import "typeface-roboto";
import { ModalProvider } from "./ModalContext";

const ThemeContext = createContext(null);

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a SThemeProvider");
  }

  return context;
}

const SThemeProvider = ({ children }) => {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";
  // const mainPrimaryColor = darkState ? deepOrange[500] : cyan[700];
  // const mainSecondaryColor = darkState ? "#448aff" : red[400];
  const mainPrimaryColor = darkState ? deepOrange[500] : blue[700];
  const mainSecondaryColor = darkState ? pink[500] : red[400];
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
    typography: {
      fontFamily: ["Roboto", "serif"].join(","),
    },
    overrides: {
      MuiFormControl: {
        marginNormal: {
          marginTop: "8px",
        },
      },
      MuiCssBaseline: {
        "@global": {
          a: {
            color: "unset",
          },
        },
      },
    },
  });

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, darkState, handleThemeChange }}>
      <ThemeProvider theme={darkTheme}>
        <StyledThemeProvider theme={darkTheme}>
          <SocketProvider>
            <ModalProvider>{children}</ModalProvider>
          </SocketProvider>
        </StyledThemeProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default SThemeProvider;
