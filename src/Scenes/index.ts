import { GameObject } from "../GameObject";
import { SceneConfig } from "../SceneController";

export const Scenes: Record<string, SceneConfig> = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 5,
        y: 6,
      }),
      npc1: new GameObject({
        x: 7,
        y: 9,
        src: "/images/characters/people/npc1.png",
      }),
    },
  },
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 1,
      }),
      npcA: new GameObject({
        x: 9,
        y: 2,
        src: "/images/characters/people/npc2.png",
      }),
      npcB: new GameObject({
        x: 10,
        y: 4,
        src: "/images/characters/people/npc3.png",
      }),
    },
  },
};
