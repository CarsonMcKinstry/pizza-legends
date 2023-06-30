import { KeyPressListener } from "../../Inputs/KeyPressListener";
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

  constructor({ text, onComplete }: TextMessageConfig) {
    this.text = text;
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.root = createRoot(this.element);

    this.root.render(
      <>
        <p className="TextMessage_p">{this.text}</p>
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
      this.actionListener?.unbind();
      this.done();
    });
  }

  done() {
    this.root?.unmount();
    this.element?.remove();
    this.onComplete();
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}
