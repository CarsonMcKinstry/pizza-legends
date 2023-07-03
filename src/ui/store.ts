import { configureStore } from "@reduxjs/toolkit";
import {
  TextMessageSlice,
  TextMessageState,
} from "./components/TextMessage/state";
import {
  SceneTransitionSlice,
  SceneTransitionState,
} from "./components/SceneTransition/state";

export type BaseUiState = {
  isOpen: boolean;
};

export type UserInterfaceState = {
  textMessage: TextMessageState;
  sceneTransition: SceneTransitionState;
};

export const store = configureStore<UserInterfaceState>({
  reducer: {
    textMessage: TextMessageSlice.reducer,
    sceneTransition: SceneTransitionSlice.reducer,
  },
  // eslint-disable-next-line
  // @ts-ignore
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
