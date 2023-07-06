import { Character } from "@/Entities/Character";
import { GlobalEventHandler, globalEvents } from "@/Inputs/GlobalEvents";

import { SceneEvent } from "@/SceneEvent";
import { TextMessage } from "@/Ui/TextMessage";
import { Direction } from "@/types";
import { oppositeDirection } from "@/utils";
import { DetailedAction, createBehaviorHandler } from "./createBehaviorHandler";
import { SceneTransition } from "@/Ui/SceneTranstion";

export const sceneBehaviorHandler = createBehaviorHandler({
  exampleState: {} as SceneEvent,
  handlers: {
    walk(
      sceneEvent,
      action: DetailedAction<{
        direction: Direction;
        who?: string;
        retry?: true;
      }>
    ) {
      const { details } = action;
      const whoId = details.who;
      const who = whoId ? sceneEvent.scene.entities[whoId] : null;

      if (who && who instanceof Character) {
        if (whoId !== "hero") {
          details.retry = true;
        }

        const completeHandler: GlobalEventHandler<"PersonWalkingComplete"> = (
          e
        ) => {
          if (e.detail.whoId === whoId) {
            globalEvents.off("PersonWalkingComplete", completeHandler);
            sceneEvent.resolve?.();
          }
        };
        globalEvents.on("PersonWalkingComplete", completeHandler);

        who.startBehavior(
          {
            scene: sceneEvent.scene,
          },
          action
        );
      } else {
        sceneEvent.resolve?.();
      }
    },
    stand(
      sceneEvent,
      action: DetailedAction<{
        direction: Direction;
        who?: string;
        time?: number;
      }>
    ) {
      const { details } = action;
      const whoId = details.who;
      const who = whoId ? sceneEvent.scene.entities[whoId] : null;

      if (who && who instanceof Character) {
        const completeHandler: GlobalEventHandler<"PersonStandComplete"> = (
          e
        ) => {
          if (e.detail.whoId === whoId) {
            globalEvents.off("PersonStandComplete", completeHandler);
            sceneEvent.resolve?.();
          }
        };

        globalEvents.on("PersonStandComplete", completeHandler);

        who.startBehavior(
          {
            scene: sceneEvent.scene,
          },
          action
        );
      } else {
        sceneEvent.resolve?.();
      }
    },
    textMessage(
      sceneEvent,
      action: DetailedAction<{
        text: string;
        who?: string;
        faceHero?: true;
      }>
    ) {
      const { text, who: whoId, faceHero } = action.details;

      if (faceHero && whoId) {
        const who = sceneEvent.scene.entities[whoId];

        if (who) {
          who.direction = oppositeDirection(
            sceneEvent.scene.entities["hero"].direction
          );
        }
      }

      const message = new TextMessage({
        text,
        onComplete() {
          sceneEvent.resolve?.();
        },
      });

      message.init(sceneEvent.scene.overlay);
    },
    changeScene(sceneEvent, action: DetailedAction<{ scene: string }>) {
      const transition = new SceneTransition({
        onComplete() {
          sceneEvent.scene.game?.startScene(action.details.scene);

          transition.fadeOut();

          sceneEvent.resolve?.();
        },
      });
      transition.init(sceneEvent.scene.overlay);
    },
  },
});

export type SceneBehaviorType = ReturnType<
  (typeof sceneBehaviorHandler.actions)[keyof typeof sceneBehaviorHandler.actions]
>;

export const SceneBehaviors = sceneBehaviorHandler.actions;

export const isSceneBehavior = <B extends keyof typeof SceneBehaviors>(
  behaviorType: B,
  behavior: any
): behavior is ReturnType<(typeof SceneBehaviors)[B]> => {
  return behavior.type === behaviorType;
};
