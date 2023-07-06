import { createSlice } from "@reduxjs/toolkit";

export type BattleMessageState = {
  isOpen: boolean;
};

export const battleMessageSlice = createSlice({
  name: "BattleMessage",
  initialState: { isOpen: false } as BattleMessageState,
  reducers: {
    open(state) {
      state.isOpen = true;
    },
    close(state) {
      state.isOpen = false;
    },
  },
});
