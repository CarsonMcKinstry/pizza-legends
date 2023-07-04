import { asGridCoords, withGrid } from "@/utils";
import { Character } from "@/Entities/Character";

import { SceneConfig } from "@/SceneController";
import { SceneBehaviors } from "@/Behaviors/SceneBehaviors";

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
      npcA: new Character({
        x: withGrid(7),
        y: withGrid(9),
        spriteName: "npc1",
        behaviorLoop: [
          SceneBehaviors.stand({ direction: "left", time: 800 }),
          SceneBehaviors.stand({ direction: "up", time: 800 }),
          SceneBehaviors.stand({ direction: "right", time: 1200 }),
          SceneBehaviors.stand({ direction: "up", time: 800 }),
        ],
      }),
      npcB: new Character({
        x: withGrid(3),
        y: withGrid(7),
        spriteName: "npc2",
        behaviorLoop: [
          SceneBehaviors.walk({ direction: "left" }),
          SceneBehaviors.stand({ direction: "up", time: 800 }),
          SceneBehaviors.walk({ direction: "up" }),
          SceneBehaviors.walk({ direction: "right" }),
          SceneBehaviors.walk({ direction: "down" }),
        ],
      }),
    },
    walls: {
      [asGridCoords(7, 6)]: true,
      [asGridCoords(8, 6)]: true,
      [asGridCoords(7, 7)]: true,
      [asGridCoords(8, 7)]: true,
    },
  },
  // Kitchen: {
  //   backgroundSrc: "/images/maps/KitchenLower.png",
  //   foregroundSrc: "/images/maps/KitchenUpper.png",
  //   entities: {
  //     hero: new Entity({
  //       x: 3,
  //       y: 1,
  //     }),
  //     npcA: new Entity({
  //       x: 9,
  //       y: 2,
  //       src: "/images/characters/people/npc2.png",
  //     }),
  //     npcB: new Entity({
  //       x: 10,
  //       y: 4,
  //       src: "/images/characters/people/npc3.png",
  //     }),
  //   },
  // },
};
