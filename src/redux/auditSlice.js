
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { runWebsiteAudit } from "../services/auditApi";

// Async API call
export const fetchAudit = createAsyncThunk(
    "audit/fetchAudit",
    async (url, thunkAPI) => {
        try {
            const data = await runWebsiteAudit(url);

            console.log("BACKEND RESPONSE:", data);

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);;

// Initial Redux state
const initialState = {
    auditData: null,
    loading: false,
    error: null,
};

// Slice
const auditSlice = createSlice({
    name: "audit",
    initialState,

    reducers: {
        clearAudit: (state) => {
            state.auditData = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAudit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAudit.fulfilled, (state, action) => {
                state.loading = false;
                state.auditData = action.payload;
            })

            .addCase(fetchAudit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAudit } = auditSlice.actions;

export default auditSlice.reducer;
