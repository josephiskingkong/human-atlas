import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTool: 'Курсор',
    currMenu: 'close',
    searchString: '',
    targetPoint: {
        description: '',
        id: 0,
        name: '',
        organid: 0,
        x: 0,
        y: 0,
    },
};

const atlasSlice = createSlice({
    name: 'atlas',
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
    }
});

export const {
    setActiveTool,
    setCurrMenu,
    setSearchString,
    setTargetPoint
} = atlasSlice.actions;

export default atlasSlice.reducer;