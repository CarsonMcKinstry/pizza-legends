import "./SceneTransition.css";
import { ReactNode } from "react";
import { UiElement } from "../UiElement";
import { createStore } from "zustand";
import { Transition } from "./Transition";

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
