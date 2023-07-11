import "@/styles/TextMessage.css";
import React, { JSX } from "jsx-dom";

import { KeyPressListener } from "@/Inputs/KeyPressListener";
import { RevealingText } from "./RevealingText";

type TextMessageConfig = {
  text: string;
  onComplete: () => void;
};

export class TextMessage {
  text: string;
  actionListener?: KeyPressListener;
  element?: JSX.Element;
  revealingText?: RevealingText;

  onComplete: () => void;

  constructor(config: TextMessageConfig) {
    this.text = config.text;
    this.onComplete = config.onComplete;
  }

  createElement() {
    this.element = (
      <div className="TextMessage">
        <p className="TextMessage_p"></p>
        <button
          className="TextMessage_button"
          onClick={() => {
            this.done();
          }}
        >
          Continue...
        </button>
      </div>
    );

    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p")!,
      text: this.text,
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText?.isDone) {
      this.element?.remove();
      this.actionListener?.unbind();
      this.onComplete();
    } else {
      this.revealingText?.warpToDone();
    }
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
    this.revealingText?.init();
  }
}
