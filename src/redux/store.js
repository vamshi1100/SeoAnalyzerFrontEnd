
import { configureStore } from "@reduxjs/toolkit";
import auditReducer from "./auditSlice";

export const store = configureStore({
    reducer: {
        audit: auditReducer,
    },
});
