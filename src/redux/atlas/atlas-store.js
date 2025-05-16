import { configureStore } from '@reduxjs/toolkit';
import atlasReducer from './atlas-slice'

const store = configureStore({
    reducer: {
        atlas: atlasReducer
    }
});

export default store;