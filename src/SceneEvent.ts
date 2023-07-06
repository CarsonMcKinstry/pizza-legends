import {
  sceneBehaviorHandler,
  SceneBehaviorType,
} from "@/Behaviors/SceneBehaviors";
import { SceneController } from "@/SceneController";

type EventResolver = (value?: unknown) => void;

type SceneEventConfig = {
  scene: SceneController;
  event: SceneBehaviorType;
};

export class SceneEvent {
  scene: SceneController;
  event: SceneBehaviorType;
  resolve?: EventResolver;

  constructor({ scene, event }: SceneEventConfig) {
    this.event = event;
    this.scene = scene;
  }

  init() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      sceneBehaviorHandler.run(this, this.event);
    });
  }
}
