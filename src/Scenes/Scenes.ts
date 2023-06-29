import { behavior } from "../Behaviors";
import { Person } from "../Objects/Person";
import { SceneConfig } from "../types";
import { asGridCoords } from "../utils/asGridCoords";
import { withGrid } from "../utils/withGrid";

export const Scenes: Record<string, SceneConfig> = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        x: withGrid(5),
        y: withGrid(6),
        spriteName: "hero",
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: withGrid(7),
        y: withGrid(9),
        spriteName: "npc1",
        behaviorLoop: [
          behavior.stand({ direction: "left", time: 800 }),
          behavior.stand({ direction: "up", time: 800 }),
          behavior.stand({ direction: "right", time: 1200 }),
          behavior.stand({ direction: "up", time: 300 }),
        ],
      }),
      npcB: new Person({
        x: withGrid(3),
        y: withGrid(7),
        spriteName: "npc2",
        behaviorLoop: [
          behavior.walk({ direction: "left" }),
          behavior.stand({ direction: "up", time: 800 }),
          behavior.walk({ direction: "up" }),
          behavior.walk({ direction: "right" }),
          behavior.walk({ direction: "down" }),
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
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: withGrid(3),
        y: withGrid(1),
        spriteName: "hero",
      }),
      npcA: new Person({
        x: withGrid(9),
        y: withGrid(2),
        spriteName: "npc2",
      }),
      npcB: new Person({
        x: withGrid(10),
        y: withGrid(4),
        spriteName: "npc3",
      }),
    },
    walls: {},
  },
};
