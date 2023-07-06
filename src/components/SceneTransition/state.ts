import { createSlice } from "@reduxjs/toolkit";

export type SceneTransitionState = {
  isDone: boolean;
};

export const sceneTransitionSlice = createSlice({
  name: "SceneTransition",
  initialState: {
    isDone: false,
  } as SceneTransitionState,
  reducers: {
    done(state) {
      state.isDone = true;
    },
  },
});
