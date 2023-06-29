import { GameObject } from "./GameObject";

export type Direction = "up" | "down" | "left" | "right";

export type FrameCoords = [number, number];

export type Animations = Record<string, FrameCoords[]>;

export interface SceneConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: Record<string, GameObject>;
  walls: Record<string, true>;
}
