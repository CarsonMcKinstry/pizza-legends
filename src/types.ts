import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";

export type Direction = "up" | "right" | "down" | "left";

export type CutsceneConfig = {
  events: SceneBehaviorType[];
};

export type TriggerSpaces = Record<string, CutsceneConfig[]>;
