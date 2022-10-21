import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./Reducer/TaskSlice";
export default configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
