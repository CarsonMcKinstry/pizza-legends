import { withGrid } from "@/utils";
import { Character } from "@/Entities/Character";
import { Entity } from "@/Entity";
import { SceneConfig } from "@/SceneController";

export const Scenes: Record<string, SceneConfig> = {
  DemoRoom: {
    backgroundSrc: "/images/maps/DemoLower.png",
    foregroundSrc: "/images/maps/DemoUpper.png",
    entities: {
      hero: new Character({
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
        spriteName: "hero",
      }),
      //   npc1: new Entity({
      //     x: 7,
      //     y: 9,
      //     src: "/images/characters/people/npc1.png",
      //   }),
    },
  },
  Kitchen: {
    backgroundSrc: "/images/maps/KitchenLower.png",
    foregroundSrc: "/images/maps/KitchenUpper.png",
    entities: {
      hero: new Entity({
        x: 3,
        y: 1,
      }),
      npcA: new Entity({
        x: 9,
        y: 2,
        src: "/images/characters/people/npc2.png",
      }),
      npcB: new Entity({
        x: 10,
        y: 4,
        src: "/images/characters/people/npc3.png",
      }),
    },
  },
};
