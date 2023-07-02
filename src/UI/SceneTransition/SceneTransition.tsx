import "./SceneTransition.css";
import { ReactNode } from "react";
import { UiElement } from "../UiElement";
import { createStore } from "zustand";
import { StoreApi, useStore } from "zustand";
import clsx from "clsx";

interface SceneTransitionConfig {
  onComplete: () => void;
}

export class SceneTransition extends UiElement<{ fadeInFinished: boolean }> {
  onComplete: () => void;
  constructor({ onComplete }: SceneTransitionConfig) {
    super("SceneTransition");

    this.state = createStore(() => ({
      fadeInFinished: false,
    }));

    this.onComplete = onComplete;
  }

  fadeOut() {
    this.state?.setState({
      fadeInFinished: true,
    });
  }

  override bindActionListeners(): void {}

  override render(): ReactNode {
    return <Transition state={this.state!} onComplete={this.onComplete} />;
  }
}

type TransitionProps = {
  state: StoreApi<{ fadeInFinished: boolean }>;
  onComplete: () => void;
};

export const Transition = ({ state, onComplete }: TransitionProps) => {
  const { fadeInFinished } = useStore(state);

  return (
    <div
      className={clsx("container", {
        "fade-out": fadeInFinished,
      })}
      onAnimationEnd={() => {
        if (!fadeInFinished) {
          onComplete();
        }
      }}
    />
  );
};
