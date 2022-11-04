import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./Reducer/AppSlice";
import taskReducer from "./Reducer/TaskSlice";
export default configureStore({
  reducer: {
    tasks: taskReducer,
    app: appReducer,
  },
});
