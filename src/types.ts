import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";

export type Direction = "up" | "right" | "down" | "left";

export type CutsceneConfig = {
  events: SceneBehaviorType[];
};

export type TriggerSpaces = Record<string, CutsceneConfig[]>;

export enum Status {
  Saucy = "saucy",
  Clumsy = "clumsy",
}

export type CombatantStatus = {
  type: Status;
  expiresIn: number;
};

export type TeamType = "player" | "enemy";

export enum TargetType {
  Friendly = "friendly",
}

export type Item = {
  actionId: string;
  instanceId: string;
  team: TeamType;
};
