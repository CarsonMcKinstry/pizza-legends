// import { Direction } from "./types";

import { Ability } from "../Content/Abilities";
import { CombatantStatus, StatusAilment, Team } from "../types";
import { BuildBehaviorType, createBehaviors } from "../utils/createBehaviors";

export const battleBehavior = createBehaviors<{
  textMessage: {
    text: string;
    casterId?: string;
    ability?: Ability;
    targetId?: string;
    status?: StatusAilment;
  };
  submissionMenu: {
    caster: string;
    enemy: string;
  };
  stateChange: {
    damage?: number;
    status?: CombatantStatus;
    recover?: number;
    targetId?: string;
    casterId?: string;
    onCaster?: boolean;
  };
  animation: {
    casterId?: string;
    animation: string;
    team?: Team;
    color?: string;
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
