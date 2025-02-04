import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalState } from "../../../types/redux.type";

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  selectedData: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setSelectedData: (state, action: PayloadAction<any>) => {
      state.selectedData = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ type: ModalState["modalType"]; data?: any }>
    ) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.selectedData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.selectedData = null;
    },
  },
});

export const { openModal, closeModal, setSelectedData } = modalSlice.actions;
export default modalSlice.reducer;
