import { Person } from "../Objects/Person";
import { SceneConfig } from "../SceneController";
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
      npc1: new Person({
        x: withGrid(7),
        y: withGrid(9),
        spriteName: "npc1",
      }),
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
  },
};
