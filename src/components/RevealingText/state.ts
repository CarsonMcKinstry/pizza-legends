import { createSlice } from "@reduxjs/toolkit";

export type RevealingTextState = {
  done: boolean;
};

export const revealingTextSlice = createSlice({
  name: "RevealingText",
  initialState: {
    done: false,
  } as RevealingTextState,
  reducers: {
    done(state) {
      state.done = true;
    },
  },
});
