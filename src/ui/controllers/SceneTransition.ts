import { SceneController } from "../../SceneController";
import { SceneTransitionActions } from "../components/SceneTransition/state";

type SceneTransitionConfig = {
  onComplete: () => void;
};

export class SceneTransition {
  onComplete: () => void;
  scene: SceneController;

  constructor({ onComplete }: SceneTransitionConfig, scene: SceneController) {
    this.onComplete = onComplete;
    this.scene = scene;
  }

  fadeOut() {
    this.scene.game?.userInterface.store.dispatch(
      SceneTransitionActions.fadeInFinished()
    );
  }

  init() {
    this.scene.game?.userInterface.dispatch(
      SceneTransitionActions.open(this.onComplete)
    );
  }
}
