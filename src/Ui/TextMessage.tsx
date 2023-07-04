import { KeyPressListener } from "@/Inputs/KeyPressListener";
import { RevealingText, revealingTextSlice } from "@/components/RevealingText";
import { RevealingTextState } from "@/components/RevealingText/state";
import "@/styles/TextMessage.css";
import { Store, configureStore } from "@reduxjs/toolkit";
import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";

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

  store: Store<{ revealingText: RevealingTextState }>;

  constructor({ text, onComplete }: TextMessageConfig) {
    this.text = text;
    this.onComplete = onComplete;

    this.store = configureStore({
      reducer: {
        revealingText: revealingTextSlice.reducer,
      },
    });
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.root = createRoot(this.element);

    this.root.render(
      <Provider store={this.store}>
        <p className="TextMessage_p m-0">
          <RevealingText
            text={this.text}
            onComplete={() => {
              this.store.dispatch(revealingTextSlice.actions.done());
            }}
          />
        </p>
        <button
          className="TextMessage_button"
          onClick={() => {
            this.done();
          }}
        >
          Continue...
        </button>
      </Provider>
    );

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener?.unbind();
      this.done();
    });
  }

  get isDone() {
    return this.store.getState().revealingText.done;
  }

  done() {
    if (this.isDone) {
      this.root?.unmount();
      this.element?.remove();
      this.actionListener?.unbind();
      this.onComplete();
    } else {
      this.store.dispatch(revealingTextSlice.actions.done());
    }
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }
}
