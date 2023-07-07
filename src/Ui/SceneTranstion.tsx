import React, { JSX } from "jsx-dom";
import "@/styles/SceneTransition.css";

type SceneTransitionConfig = {
  onComplete: () => void;
};

export class SceneTransition {
  element?: JSX.Element;

  isDone = false;

  onComplete: () => void;

  constructor(config: SceneTransitionConfig) {
    this.onComplete = config.onComplete;
  }

  createElement() {
    this.element = (
      <div
        className="SceneTransition"
        onAnimationEnd={() => {
          if (!this.isDone) {
            this.isDone = true;
            this.onComplete();
          }
        }}
      />
    );
  }

  fadeOut() {
    this.element?.classList.add("fade-out");
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}
