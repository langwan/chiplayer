import { createSlice } from "@reduxjs/toolkit";

export const AppSlice = createSlice({
  name: "app",
  initialState: {
    app: {
      version: "1.0.0",
      build: "",
    },
  },
  reducers: {
    setApp: (state, action) => {
      state.app = action.payload;
    },
  },
});

export const { setApp } = AppSlice.actions;
export default AppSlice.reducer;
