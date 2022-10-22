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

let pushCallbacks = {};

export const sioPushRegister = (method, callback) => {
  if (!pushCallbacks[method]) {
    pushCallbacks[method] = [callback];
  } else {
    pushCallbacks[method].push(callback);
  }
  console.log("sioPushRegister", pushCallbacks);
};

export const sioPushUnRegister = (method, callback) => {
  if (pushCallbacks[method]) {
    for (let i in pushCallbacks[method]) {
      if (pushCallbacks[method][i] == callback) {
        pushCallbacks[method].splice(i, 1);
      }
    }
  }
};

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
      } else {
        if (pushCallbacks[message.method]) {
          pushCallbacks[message.method].forEach((element) => {
            element(message.body);
          });
        }
      }
    });
    sio.on("hello", (message) => {
      console.log("message", message);
    });
  }, []);
  return <RouterProvider router={router} />;
};
