import { createSlice } from "@reduxjs/toolkit";

export const TaskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = TaskSlice.actions;
export default TaskSlice.reducer;
