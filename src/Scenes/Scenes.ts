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
        talking: [
          {
            events: [
              behavior.textMessage({ text: "I'm busy...", faceHero: true }),
              behavior.textMessage({ text: "Go away." }),
              behavior.walk({ direction: "up", who: "hero" }),
            ],
          },
        ],
      }),
      npcB: new Person({
        x: withGrid(8),
        y: withGrid(5),
        spriteName: "npc2",
      }),
    },
    walls: {
      [asGridCoords(7, 6)]: true,
      [asGridCoords(8, 6)]: true,
      [asGridCoords(7, 7)]: true,
      [asGridCoords(8, 7)]: true,
    },
    triggerSpaces: {
      [asGridCoords(7, 4)]: [
        {
          events: [
            behavior.walk({ direction: "left", who: "npcB" }),
            behavior.stand({ direction: "up", who: "npcB" }),
            behavior.textMessage({ text: "You can't be in there!" }),
            behavior.walk({ direction: "right", who: "npcB" }),
            behavior.stand({ direction: "down", who: "npcB" }),
            behavior.walk({ direction: "down", who: "hero" }),
            behavior.walk({ direction: "left", who: "hero" }),
          ],
        },
      ],
      [asGridCoords(5, 10)]: [
        {
          events: [
            behavior.changeScene({
              scene: "Kitchen",
            }),
          ],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: withGrid(5),
        y: withGrid(5),
        spriteName: "hero",
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: withGrid(10),
        y: withGrid(8),
        spriteName: "npc2",
        talking: [
          {
            events: [
              behavior.textMessage({
                text: "You made it to the kitchen! I'm so proud of you!",
                faceHero: true,
              }),
              behavior.stand({ direction: "down" }),
            ],
          },
        ],
      }),
      // npcB: new Person({
      //   x: withGrid(10),
      //   y: withGrid(4),
      //   spriteName: "npc3",
      // }),
    },
    walls: {},
  },
};
