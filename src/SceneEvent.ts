import { Behavior, BehaviorType, behavior, isBehavior } from "./Behaviors";
import { GlobalEventHandler, globalEvents } from "./GlobalEvents";
import { SceneController } from "./SceneController";

type EventResolver = (value?: unknown) => void;

type SceneEventHandlers = {
  [Key in BehaviorType]: (res: EventResolver) => void;
};

interface Config {
  scene: SceneController;
  event: Behavior;
}

export class SceneEvent implements SceneEventHandlers {
  scene: SceneController;
  event: Behavior;

  constructor({ scene, event }: Config) {
    this.scene = scene;
    this.event = event;
  }

  walk(resolve: EventResolver) {
    const who = this.event.who ? this.scene.gameObjects[this.event.who] : null;

    if (isBehavior(this.event, "walk") && who) {
      this.event.retry = true;

      who.startBehavior(
        {
          scene: this.scene,
        },
        this.event
      );
      const completeHandler: GlobalEventHandler<"PersonWalkingComplete"> = (
        e
      ) => {
        if (e.detail.whoId === this.event.who) {
          globalEvents.off("PersonWalkingComplete", completeHandler);
          resolve();
        }
      };

      globalEvents.on("PersonWalkingComplete", completeHandler);
    }
  }

  stand(resolve: EventResolver) {
    const who = this.event.who ? this.scene.gameObjects[this.event.who] : null;

    if (who) {
      who.startBehavior(
        {
          scene: this.scene,
        },
        this.event
      );
      const completeHandler: GlobalEventHandler<"PersonStandComplete"> = (
        e
      ) => {
        if (e.detail.whoId === this.event.who) {
          globalEvents.off("PersonStandComplete", completeHandler);
          resolve();
        }
      };

      globalEvents.on("PersonStandComplete", completeHandler);
    }
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
