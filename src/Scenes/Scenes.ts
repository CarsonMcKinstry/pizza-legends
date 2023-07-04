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
        talking: [
          {
            events: [
              SceneBehaviors.textMessage({
                text: "I'm busy...",
                faceHero: true,
              }),
              SceneBehaviors.textMessage({ text: "Go away." }),
              SceneBehaviors.walk({ direction: "up", who: "hero" }),
            ],
          },
        ],
      }),
      npcB: new Character({
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
            SceneBehaviors.walk({ direction: "left", who: "npcB" }),
            SceneBehaviors.stand({ direction: "up", who: "npcB" }),
            SceneBehaviors.textMessage({ text: "You can't be in there!" }),
            SceneBehaviors.walk({ direction: "right", who: "npcB" }),
            SceneBehaviors.stand({ direction: "down", who: "npcB" }),
            SceneBehaviors.walk({ direction: "down", who: "hero" }),
            SceneBehaviors.walk({ direction: "left", who: "hero" }),
          ],
        },
      ],
      [asGridCoords(5, 10)]: [
        {
          events: [SceneBehaviors.changeScene({ scene: "Kitchen" })],
        },
      ],
    },
  },
  Kitchen: {
    backgroundSrc: "/images/maps/KitchenLower.png",
    foregroundSrc: "/images/maps/KitchenUpper.png",
    entities: {
      hero: new Character({
        x: withGrid(5),
        y: withGrid(5),
        spriteName: "hero",
        isPlayerControlled: true,
      }),
    },
    triggerSpaces: {
      [asGridCoords(5, 10)]: [
        {
          events: [SceneBehaviors.changeScene({ scene: "DemoRoom" })],
        },
      ],
    },
  },
};
