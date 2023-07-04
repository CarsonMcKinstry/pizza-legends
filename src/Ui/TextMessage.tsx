import { KeyPressListener } from "@/Inputs/KeyPressListener";
import "@/styles/TextMessage.css";
import { Root, createRoot } from "react-dom/client";

type TextMessageConfig = {
  text: string;
  onComplete: () => void;
};

export class TextMessage {
  root?: Root;
  element?: HTMLElement;

  text: string;
  onComplete: () => void;

  actionListener?: KeyPressListener;

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
        <p className="TextMessage_p m-0">{this.text}</p>
        <button
          className="TextMessage_button"
          onClick={() => {
            this.done();
          }}
        >
          Continue...
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
