import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "App";
import "App.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import theme from "Themes/Default";
import store from "./Store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);
