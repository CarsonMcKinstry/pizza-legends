import "@/styles/SceneTransition.css";
import { Store, configureStore, createSlice } from "@reduxjs/toolkit";
import clsx from "clsx";
import { Root, createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";

type SceneTransitionConfig = {
  onComplete: () => void;
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

export class SceneTransition {
  element?: HTMLElement;
  root?: Root;

  onComplete: () => void;

  store: Store<{ isDone: boolean }>;

  constructor({ onComplete }: SceneTransitionConfig) {
    this.onComplete = onComplete;

    this.store = configureStore({
      reducer: sceneTransitionSlice.reducer,
    });
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("SceneTransition-container");

    this.root = createRoot(this.element);

    this.root.render(
      <Provider store={this.store}>
        <SceneTransitionComponent
          onCleanup={() => {
            this.done();
          }}
          onComplete={() => {
            this.onComplete();
          }}
        />
      </Provider>
    );
  }

  fadeOut() {
    this.store.dispatch(sceneTransitionSlice.actions.done());
  }

  done() {
    this.root?.unmount();
    this.element?.remove();
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
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
  const isDone = useSelector<{ isDone: boolean }, boolean>(
    (state) => state.isDone
  );

  return (
    <div
      className={clsx("SceneTransition", {
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
