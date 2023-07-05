import { KeyPressListener } from "@/Inputs/KeyPressListener";
import { RevealingText, revealingTextSlice } from "@/components/RevealingText";
import { RevealingTextState } from "@/components/RevealingText/state";
import "@/styles/TextMessage.css";

import { UiElementConfig, UiElement } from "./UiElement";

type TextMessageState = {
  revealingText: RevealingTextState;
};

type TextMessageConfig = UiElementConfig<TextMessageState> & {
  text: string;
};

export class TextMessage extends UiElement<TextMessageState> {
  text: string;

  actionListener?: KeyPressListener;

  constructor(config: TextMessageConfig) {
    super({
      onComplete: config.onComplete,
      name: "TextMessage",
      storeConfig: {
        reducer: {
          revealingText: revealingTextSlice.reducer,
        },
      },
    });
    this.text = config.text;
  }

  render() {
    return (
      <>
        <p className="TextMessage_p m-0">
          <RevealingText
            text={this.text}
            onComplete={() => {
              this.dispatch(revealingTextSlice.actions.done());
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
      </>
    );
  }

  override afterRender() {
    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  get isDone() {
    return this.state.revealingText.done;
  }

  done() {
    if (this.isDone) {
      this.unmount();
      this.actionListener?.unbind();
      this.onComplete();
    } else {
      this.dispatch(revealingTextSlice.actions.done());
    }
  }
}
