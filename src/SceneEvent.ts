import { SceneBehavior } from "@/Behaviors/SceneBehaviors";
import { SceneController } from "@/SceneController";

type EventResolver = (value?: unknown) => void;

type SceneEventConfig = {
  scene: SceneController;
  event: SceneBehavior;
};

export class SceneEvent {
  scene: SceneController;
  event: SceneBehavior;
  resolve?: EventResolver;

  constructor({ scene, event }: SceneEventConfig) {
    this.event = event;
    this.scene = scene;
  }

  init() {
    return new Promise((resolve) => {
      this.resolve = resolve;

      SceneBehavior.reducer(this, this.event);
    });
  }
}
