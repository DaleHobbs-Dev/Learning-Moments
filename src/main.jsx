import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// 👇 Material UI imports
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark", // enable dark mode behavior
    primary: {
      main: "#2e7d32", // matches --color-primary
      light: "#60ad5e",
      dark: "#005005",
    },
    secondary: {
      main: "#80cbc4",
      dark: "#26a69a",
    },
    background: {
      default: "#121212", // body background
      paper: "#1e1e1e", // surfaces like cards, nav, etc.
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#1e1e1e", // matches your surface color
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* MUI’s global CSS reset */}
        {/* 👇 React Router setup */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
