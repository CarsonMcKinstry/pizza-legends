import { configureStore } from "@reduxjs/toolkit";
import {
  TextMessageSlice,
  TextMessageState,
} from "./components/TextMessage/state";

export type BaseUiState = {
  isOpen: boolean;
};

export type UserInterfaceState = {
  textMessage: TextMessageState;
};

export const store = configureStore<UserInterfaceState>({
  reducer: {
    textMessage: TextMessageSlice.reducer,
  },
  // eslint-disable-next-line
  // @ts-ignore
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
