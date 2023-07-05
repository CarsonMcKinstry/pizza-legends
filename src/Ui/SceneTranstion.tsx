import "@/styles/SceneTransition.css";
import { createSlice } from "@reduxjs/toolkit";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { UiElement, UiElementConfig } from "./UiElement";

type SceneTransitionState = {
  isDone: boolean;
};

const sceneTransitionSlice = createSlice({
  name: "SceneTransition",
  initialState: {
    isDone: false,
  },
  reducers: {
    done(state) {
      state.isDone = true;
    },
  },
});

export class SceneTransition extends UiElement<SceneTransitionState> {
  constructor(config: UiElementConfig) {
    super({
      name: "SceneTransition",
      ...config,
      storeConfig: {
        reducer: sceneTransitionSlice.reducer,
      },
    });
  }

  override render(): JSX.Element {
    return (
      <SceneTransitionComponent
        onCleanup={() => {
          this.unmount();
        }}
        onComplete={() => {
          this.onComplete();
        }}
      />
    );
  }

  fadeOut() {
    this.dispatch(sceneTransitionSlice.actions.done());
  }
}

type SceneTransitionProps = {
  onComplete: () => void;
  onCleanup: () => void;
};

export const SceneTransitionComponent = ({
  onCleanup,
  onComplete,
}: SceneTransitionProps) => {
  const isDone = useSelector<SceneTransitionState, boolean>(
    (state) => state.isDone
  );

  return (
    <div
      className={clsx("SceneTransition-container", {
        "fade-out": isDone,
      })}
      onAnimationEnd={() => {
        if (isDone) {
          onCleanup();
        } else {
          onComplete();
        }
      }}
    />
  );
};
