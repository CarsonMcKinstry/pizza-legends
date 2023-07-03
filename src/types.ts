import { Behavior } from "./Behaviors";
import { GameObject } from "./GameObject";

export type Direction = "up" | "down" | "left" | "right";

export type FrameCoords = [number, number];

export type Animations = Record<string, FrameCoords[]>;

export type CutsceneConfig = {
  events: Behavior[];
};

export type TriggerSpaces = Record<string, CutsceneConfig[]>;

export interface SceneConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: Record<string, GameObject>;
  walls: Record<string, true>;
  triggerSpaces?: TriggerSpaces;
}

export type Team = "player" | "enemy";

export type CombatantStatus = {
  type: "saucy" | "clumsy";
  expiresIn: number;
};
