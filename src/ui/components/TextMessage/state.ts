import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type BaseUiState } from "../../store";
import { baseActions } from "../../baseActions";

export type TextMessageState = BaseUiState & {
  text?: string;
  isRevealingTextDone: boolean;
  onComplete?: () => void;
};

const initialState: TextMessageState = {
  isOpen: false,
  isRevealingTextDone: false,
};

export const TextMessageSlice = createSlice({
  name: "TextMessage",
  initialState,
  reducers: {
    open: (
      state,
      action: PayloadAction<{ text: string; onComplete: () => void }>
    ) => {
      state.isOpen = true;
      state.isRevealingTextDone = false;
      state.text = action.payload.text;
      state.onComplete = action.payload.onComplete;
    },
    done: (state) => {
      state.isRevealingTextDone = true;
    },
    close: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(baseActions.reset.type, () => {
      return initialState;
    });
  },
});

export const TextMessageActions = TextMessageSlice.actions;
