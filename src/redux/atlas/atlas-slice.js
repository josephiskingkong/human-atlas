import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTool: 'Курсор',
    isMenuOpen: false,
    isInfoOpen: false,
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
        setIsMenuOpen(state, action) {
            state.isMenuOpen = action.payload;
            
            if (action.payload) {
                state.isInfoOpen = false;
            }
        },
        setIsInfoOpen(state, action) {
            state.isInfoOpen = action.payload

            if (action.payload) {
                state.isMenuOpen = false;
            }
        },
        setTargetPoint(state, action) {
            state.targetPoint = action.payload;
        },
    }
});

export const {
    setActiveTool,
    setIsMenuOpen,
    setIsInfoOpen,
    setTargetPoint
} = atlasSlice.actions;

export default atlasSlice.reducer;