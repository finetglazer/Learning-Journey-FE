// External
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Internal
import SliceName from "./slice.name";

const initialCommonState = {
  loading: false,
  toast: {
    type: "error",
    message: "diemtv",
    show: false,
  },
  isAuthorized: false,
};
type TypeToast = "success" | "error" | "warn";
export type ToastType = {
  show: boolean;
  type: TypeToast;
  message: string;
};

const commonSlice = createSlice({
  name: SliceName.Common,
  initialState: initialCommonState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastType>) => {
      state.toast = action.payload;
    },
    setIsAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export default commonSlice;
