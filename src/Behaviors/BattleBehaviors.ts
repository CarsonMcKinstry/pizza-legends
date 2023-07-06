import { DetailedAction } from "./createBehaviorHandler/action";
import { createBehaviorHandler } from "./createBehaviorHandler";

export const battleBehaviorHandler = createBehaviorHandler({
  exampleState: {},
  handlers: {
    textMessage(_state, action: DetailedAction<{ text: string }>) {
      console.log("A MESSAGE!");
    },
    animation(_state, action: DetailedAction<{ name: string }>) {},
    damage(_state, action: DetailedAction<{ damage: number }>) {},
  },
});

export type BattleBehaviorType = ReturnType<
  (typeof battleBehaviorHandler.actions)[keyof typeof battleBehaviorHandler.actions]
>;

export const BattleBehaviors = battleBehaviorHandler.actions;
