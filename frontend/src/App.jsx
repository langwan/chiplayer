import "App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "Router";
import io from "socket.io-client";
import { setTasks } from "Store/Reducer/TaskSlice";
const sio = io(
  process.env.NODE_ENV === "development" ? "ws://127.0.0.1:8000" : "/",
  {
    transports: ["websocket"],
    reconnect: true,
  }
);
export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    sio.on("connect", (message) => {
      console.log(message);
    });
    sio.on("push", (message) => {
      console.log("message", message);
      if (message.method == "tasks") {
        dispatch(setTasks(message.body));
      }
    });
    sio.on("hello", (message) => {
      console.log("message", message);
    });
  }, []);
  return <RouterProvider router={router} />;
};
