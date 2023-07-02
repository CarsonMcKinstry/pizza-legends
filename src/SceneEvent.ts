import { AsBehavior, Behavior, BehaviorType } from "./Behaviors";
import { GlobalEventHandler, globalEvents } from "./GlobalEvents";
import { SceneController } from "./SceneController";
// import { SceneTransition } from "./Ui/SceneTransition";
import { Scenes } from "./Scenes";
import { baseActions } from "./ui/baseActions";
import { TextMessageActions } from "./ui/components/TextMessage/state";
import { TextMessage } from "./ui/controllers/TextMessage";
// import { TextMessage } from "./Ui/TextMesage";
import { oppositeDrection } from "./utils/oppositeDirection";
// import { Battle } from "./ui-old/Battle";

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
  overlay: HTMLElement = document.querySelector(".game-overlay") as HTMLElement;

  constructor({ scene, event }: Config) {
    this.scene = scene;
    this.event = event;
  }

  walk(resolve: EventResolver) {
    const event = this.event as AsBehavior<"walk">;

    const who = event.who ? this.scene.gameObjects[event.who] : null;
    if (who) {
      if (event.who !== "hero") {
        event.retry = true;
      }

      const completeHandler: GlobalEventHandler<"PersonWalkingComplete"> = (
        e
      ) => {
        if (e.detail.whoId === event.who) {
          globalEvents.off("PersonWalkingComplete", completeHandler);
          resolve();
        }
      };
      globalEvents.on("PersonWalkingComplete", completeHandler);

      who.startBehavior(
        {
          scene: this.scene,
        },
        event
      );
    }
  }

  stand(resolve: EventResolver) {
    const event = this.event as AsBehavior<"stand">;

    const who = event.who ? this.scene.gameObjects[event.who] : null;

    if (who) {
      who.startBehavior(
        {
          scene: this.scene,
        },
        event
      );
      const completeHandler: GlobalEventHandler<"PersonStandComplete"> = (
        e
      ) => {
        if (e.detail.whoId === event.who) {
          globalEvents.off("PersonStandComplete", completeHandler);
          resolve();
        }
      };

      globalEvents.on("PersonStandComplete", completeHandler);
    }
  }

  textMessage(resolve: EventResolver) {
    const event = this.event as AsBehavior<"textMessage">;

    if (event.faceHero && event.who) {
      const who = this.scene.gameObjects[event.who];

      if (who) {
        who.direction = oppositeDrection(
          this.scene.gameObjects["hero"].direction
        );
      }
    }

    const message = new TextMessage(
      {
        ...event,
        onComplete: () => {
          resolve();
          this.scene.game?.userInterface.dispatch(baseActions.reset());
        },
      },
      this.scene
    );

    setTimeout(() => {
      message.init();
    }, 0);
  }

  changeScene(resolve: EventResolver) {
    const event = this.event as AsBehavior<"changeScene">;
    // const sceneTransition = new SceneTransition({
    //   onComplete: () => {
    //     const sceneConfig = Scenes[event.scene];

    //     if (sceneConfig) {
    //       this.scene.game?.startScene(sceneConfig);
    //     }
    //     resolve();
    //     sceneTransition.fadeOut();
    //   },
    // });

    // sceneTransition.init(this.overlay);
  }

  battle(resolve: EventResolver) {
    const event = this.event as AsBehavior<"battle">;

    // const battle = new Battle({
    //   onComplete: () => {
    //     resolve();
    //   },
    // });

    // battle.init(this.overlay);
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
