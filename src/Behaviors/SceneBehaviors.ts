import { SceneEvent } from "@/SceneEvent";
import { Direction } from "@/types";
import { PayloadAction, createSlice, isAllOf } from "@reduxjs/toolkit";

export const SceneBehavior = createSlice({
  name: "SceneBehavior",
  initialState: {} as SceneEvent,
  reducers: {
    walk(
      sceneEvent,
      action: PayloadAction<{
        direction: Direction;
        who?: string;
        retry?: true;
      }>
    ) {
      sceneEvent.resolve?.();
    },
    stand(
      sceneEvent,
      action: PayloadAction<{
        direction: Direction;
        who?: string;
        time?: number;
      }>
    ) {},
  },
});

export type SceneBehavior = ReturnType<
  (typeof SceneBehavior.actions)[keyof typeof SceneBehavior.actions]
>;

export const SceneBehaviors = SceneBehavior.actions;

export const isSceneBehavior = <B extends keyof typeof SceneBehaviors>(
  behaviorType: B,
  behavior: any
): behavior is ReturnType<(typeof SceneBehaviors)[B]> => {
  return isAllOf(SceneBehaviors[behaviorType])(behavior);
};
