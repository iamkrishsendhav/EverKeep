
import { configureStore } from "@reduxjs/toolkit";

// Existing reducers — keep your actual imports here.
import notificationReducer from "./notificationSlice.js";

const store = configureStore({
    reducer: {
        notifications: notificationReducer,

        // Keep your existing reducers here, for example:
        // auth: authReducer,
        // assets: assetReducer,
    },
});

export default store;
