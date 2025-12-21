import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

const initialState = {
  activeTool: "Курсор",
  currMenu: "search",
  searchString: "",
  targetPoint: {
    description: "",
    id: 0,
    name: "",
    organid: 0,
    x: 0,
    y: 0,
  },
  slideDetails: {
    description: "",
    id: 0,
    name: "",
  },
};

const atlasSlice = createSlice({
  name: "atlas",
  initialState,
  reducers: {
    setActiveTool(state, action) {
      state.activeTool = action.payload;
    },
    setCurrMenu(state, action) {
      state.currMenu = action.payload;
    },
    setSearchString(state, action) {
      state.searchString = action.payload;
    },
    setTargetPoint(state, action) {
      state.targetPoint = action.payload;
    },
    setSlideDetails(state, action) {
      state.slideDetails = action.payload;
    },
    resetAtlas() {
      return initialState;
    },
  },
});

export const {
  setActiveTool,
  setCurrMenu,
  setSearchString,
  setTargetPoint,
  setSlideDetails,
  resetAtlas,
} = atlasSlice.actions;

export default atlasSlice.reducer;
