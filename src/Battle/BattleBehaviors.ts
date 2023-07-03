// import { Direction } from "./types";

import { Ability } from "../Content/Abilities";
import { Team } from "../types";
import { BuildBehaviorType, createBehaviors } from "../utils/createBehaviors";

export const battleBehavior = createBehaviors<{
  textMessage: {
    text: string;
    casterId?: string;
    ability?: Ability;
    targetId?: string;
  };
  submissionMenu: {
    caster: string;
    enemy: string;
  };
  stateChange: {
    damage?: number;
    targetId?: string;
    casterId?: string;
  };
  animation: {
    casterId?: string;
    animation: string;
    team?: Team;
  };
}>("textMessage", "submissionMenu", "stateChange", "animation");

export type BattleBehavior = BuildBehaviorType<typeof battleBehavior>;

export type BattleBehaviorType = BattleBehavior["type"];

export type BattleBehaviorMap<State> = Partial<{
  [Key in BattleBehaviorType]: (
    state: State,
    behavior: Extract<BattleBehavior, { type: Key }>
  ) => void;
}>;

export type AsBattleBehavior<T extends BattleBehaviorType> = Extract<
  BattleBehavior,
  { type: T }
>;

export const isBattleBehavior = <T extends BattleBehaviorType>(
  behavior: BattleBehavior,
  type: T
): behavior is AsBattleBehavior<T> => {
  return behavior.type === type;
};
