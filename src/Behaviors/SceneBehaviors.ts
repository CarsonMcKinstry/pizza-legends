import { Character } from "@/Entities/Character";
import { GlobalEventHandler, globalEvents } from "@/Inputs/GlobalEvents";
import { SceneController } from "@/SceneController";

import { SceneEvent } from "@/SceneEvent";
import { Direction } from "@/types";
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

        who.startBehavior(
          {
            scene: sceneEvent.scene as SceneController,
          },
          behavior as SceneBehaviorType
        );

        const completeHandler: GlobalEventHandler<"PersonWalkingComplete"> = (
          e
        ) => {
          if (e.detail.whoId === whoId) {
            globalEvents.off("PersonWalkingComplete", completeHandler);
            sceneEvent.resolve?.();
          }
        };

        globalEvents.on("PersonWalkingComplete", completeHandler);
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
        who.startBehavior(
          {
            scene: sceneEvent.scene as SceneController,
          },
          behavior as SceneBehaviorType
        );

        const completeHandler: GlobalEventHandler<"PersonStandComplete"> = (
          e
        ) => {
          if (e.detail.whoId === whoId) {
            globalEvents.off("PersonStandComplete", completeHandler);
            sceneEvent.resolve?.();
          }
        };

        globalEvents.on("PersonStandComplete", completeHandler);
      } else {
        sceneEvent.resolve?.();
      }
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
