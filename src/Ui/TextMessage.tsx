import { KeyPressListener } from "@/Inputs/KeyPressListener";

import "@/styles/TextMessage.css";

import { UiElementConfig, UiElement } from "./UiElement";
import { TextMessageDisplay, TextMessageState } from "@/components/TextMessage";

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
      storeConfig: () => ({
        revealingText: {
          done: false,
        },
        textMessage: {
          text: config.text,
        },
      }),
    });
    this.text = config.text;
  }

  render() {
    return (
      <TextMessageDisplay
        store={this.store!}
        onContinue={() => {
          this.done();
        }}
      />
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
      this.setState({
        revealingText: {
          done: true,
        },
      });
    }
  }
}
