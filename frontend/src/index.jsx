import App from "App";
import "App.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
