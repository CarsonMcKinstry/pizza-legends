import { createStore } from "zustand";
import { KeyPressListener } from "../../Inputs/KeyPressListener";
import { RevealingText, RevealingTextProps } from "./RevealingText";
import "./TextMessage.css";
import { createRoot, Root } from "react-dom/client";

export type TextMessageConfig = {
  text: string;
  onComplete: () => void;
};

export class TextMessage {
  root: Root | null = null;
  element: HTMLElement | null = null;
  text: string;
  onComplete: () => void;

  actionListener: KeyPressListener | null = null;

  state: RevealingTextProps["state"];

  constructor({ text, onComplete }: TextMessageConfig) {
    this.text = text;
    this.onComplete = onComplete;
    this.state = createStore<{ isDone: boolean }>(() => ({
      isDone: false,
    }));
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.root = createRoot(this.element);

    this.root.render(
      <>
        <p className="TextMessage_p">
          <RevealingText text={this.text} speed={60} state={this.state} />
        </p>
        <button
          className="TextMessage_button"
          onClick={() => {
            this.done();
          }}
        >
          Next
        </button>
      </>
    );

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.state.getState().isDone) {
      this.root?.unmount();
      this.element?.remove();
      this.onComplete();
      this.actionListener?.unbind();
    } else {
      this.state.setState({ isDone: true });
    }
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}
