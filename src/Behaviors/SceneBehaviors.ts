import { Character } from "@/Entities/Character";
import { GlobalEventHandler, globalEvents } from "@/Inputs/GlobalEvents";
import { SceneController } from "@/SceneController";

import { SceneEvent } from "@/SceneEvent";
import { SceneTransition } from "@/Ui/SceneTranstion";
import { TextMessage } from "@/Ui/TextMessage";
import { Direction } from "@/types";
import { oppositeDirection } from "@/utils";
import { PayloadAction, createSlice, isAllOf } from "@reduxjs/toolkit";

export const SceneBehavior = createSlice({
  name: "SceneBehavior",
  initialState: {} as SceneEvent,
  reducers: {
    walk(
      sceneEvent,
      behavior: PayloadAction<{
        direction: Direction;
        who?: string;
        retry?: true;
      }>
    ) {
      const whoId = behavior.payload.who;
      const who = whoId ? sceneEvent.scene.entities[whoId] : null;

      if (who && who instanceof Character) {
        if (whoId !== "hero") {
          behavior.payload.retry = true;
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
            scene: sceneEvent.scene as unknown as SceneController,
          },
          behavior as SceneBehaviorType
        );
      } else {
        sceneEvent.resolve?.();
      }
      return sceneEvent;
    },
    stand(
      sceneEvent,
      behavior: PayloadAction<{
        direction: Direction;
        who?: string;
        time?: number;
      }>
    ) {
      const whoId = behavior.payload.who;
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
            scene: sceneEvent.scene as unknown as SceneController,
          },
          behavior as SceneBehaviorType
        );
      } else {
        sceneEvent.resolve?.();
      }
      return sceneEvent;
    },
    textMessage(
      sceneEvent,
      action: PayloadAction<{
        text: string;
        who?: string;
        faceHero?: true;
      }>
    ) {
      const { faceHero, who: whoId, text } = action.payload;

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

      message.init(sceneEvent.scene.overlay as unknown as HTMLElement);

      return sceneEvent;
    },
    changeScene(sceneEvent, action: PayloadAction<{ scene: string }>) {
      const transition = new SceneTransition({
        onComplete() {
          sceneEvent.scene.game?.startScene(action.payload.scene);

          transition.fadeOut();

          sceneEvent.resolve?.();
        },
      });
      transition.init(sceneEvent.scene.overlay as unknown as HTMLElement);

      return sceneEvent;
    },
  },
});

export type SceneBehaviorType = ReturnType<
  (typeof SceneBehavior.actions)[keyof typeof SceneBehavior.actions]
>;

export const SceneBehaviors = SceneBehavior.actions;

export const isSceneBehavior = <B extends keyof typeof SceneBehaviors>(
  behaviorType: B,
  behavior: unknown
): behavior is ReturnType<(typeof SceneBehaviors)[B]> => {
  return isAllOf(SceneBehaviors[behaviorType])(behavior);
};
