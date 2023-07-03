import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseUiState } from "../../store";

export type SceneTransitionState = BaseUiState & {
  onComplete?: () => void;
  fadeInFinished: boolean;
};

const initialState: SceneTransitionState = {
  isOpen: false,
  fadeInFinished: false,
};

export const SceneTransitionSlice = createSlice({
  name: "SceneTransition",
  initialState,
  reducers: {
    open: (state, action: PayloadAction<() => void>) => {
      state.isOpen = true;
      state.onComplete = action.payload;
      state.fadeInFinished = false;
    },
    fadeInFinished(state) {
      state.fadeInFinished = true;
    },
    close: (state) => {
      state.isOpen = false;
      delete state.onComplete;
    },
  },
});

export const SceneTransitionActions = SceneTransitionSlice.actions;
