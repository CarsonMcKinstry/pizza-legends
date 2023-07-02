import { createStore } from "zustand";
import { KeyPressListener } from "../../Inputs/KeyPressListener";
import { RevealingText } from "./RevealingText";
import "./TextMessage.css";
import { UiElement } from "../UiElement";

type TextMessageState = {
  isDone: boolean;
};

export type TextMessageConfig = {
  text: string;
  onComplete: () => void;
};

export class TextMessage extends UiElement<TextMessageState> {
  text: string;
  onComplete: () => void;
  keyPressListener?: KeyPressListener;

  constructor(config: TextMessageConfig) {
    super("TextMessage");
    this.text = config.text;
    this.onComplete = config.onComplete;

    this.state = createStore(() => ({
      isDone: false,
    }));
  }

  override render() {
    return (
      <>
        <p className="TextMessage_p">
          <RevealingText text={this.text} speed={60} state={this.state!} />
        </p>
        <button
          className="TextMessage_button"
          onClick={() => {
            this.done();
          }}
        >
          Continue
        </button>
      </>
    );
  }

  override bindActionListeners(): void {
    this.keyPressListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.state?.getState().isDone) {
      this.unmount();
      this.onComplete();
      this.keyPressListener?.unbind();
    } else {
      this.state?.setState({
        isDone: true,
      });
    }
  }
}
