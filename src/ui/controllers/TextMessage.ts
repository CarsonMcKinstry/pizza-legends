import { AsBehavior } from "../../Behaviors";
import { KeyPressListener } from "../../Inputs/KeyPressListener";
import { SceneController } from "../../SceneController";
import { TextMessageActions } from "../components/TextMessage/state";

type TextMessageConfig = AsBehavior<"textMessage"> & {
  onComplete: () => void;
};

export class TextMessage {
  scene: SceneController;
  text: string;
  onComplete: () => void;

  actionListener?: KeyPressListener;

  constructor(config: TextMessageConfig, scene: SceneController) {
    this.text = config.text!;
    this.scene = scene;
    this.onComplete = config.onComplete;
  }

  get isDone() {
    return this.scene.game?.userInterface.store.getState().textMessage
      .isRevealingTextDone;
  }

  done() {
    if (this.isDone) {
      this.onComplete();
      this.actionListener?.unbind();
      this.scene.game?.userInterface.dispatch(TextMessageActions.close());
    } else {
      this.scene.game?.userInterface.dispatch(TextMessageActions.done());
    }
  }

  init() {
    this.scene.game?.userInterface.dispatch(
      TextMessageActions.open({
        text: this.text,
        onComplete: this.onComplete,
      })
    );

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }
}
