import { asGridCoords, withGrid } from "@/utils";
import { SceneBehaviors } from "@/Behaviors/SceneBehaviors";
import { SceneConfig } from "./types";
import { EntityType } from "@/Entities/types";

export const Scenes: Record<string, SceneConfig> = {
  // DemoRoom: {
  //   id: "DemoRoom",
  //   backgroundSrc: "/images/maps/DemoLower.png",
  //   foregroundSrc: "/images/maps/DemoUpper.png",
  //   entities: {
  //     hero: new Character({
  //       x: withGrid(5),
  //       y: withGrid(6),
  //       isPlayerControlled: true,
  //       spriteName: "hero",
  //     }),
  //     npcA: new Character({
  //       x: withGrid(7),
  //       y: withGrid(9),
  //       spriteName: "npc1",
  //       behaviorLoop: [
  //         SceneBehaviors.stand({ direction: "left", time: 800 }),
  //         SceneBehaviors.stand({ direction: "up", time: 800 }),
  //         SceneBehaviors.stand({ direction: "right", time: 1200 }),
  //         SceneBehaviors.stand({ direction: "up", time: 800 }),
  //       ],
  //       talking: [
  //         {
  //           requires: [StoryFlag.TALKED_TO_ERIO],
  //           events: [
  //             SceneBehaviors.textMessage({
  //               text: "Isn't Erio the coolest?",
  //               faceHero: true,
  //             }),
  //           ],
  //         },
  //         {
  //           events: [
  //             SceneBehaviors.textMessage({
  //               text: "I'm going to crush you!",
  //               faceHero: true,
  //             }),
  //             SceneBehaviors.battle({
  //               enemyId: "beth",
  //             }),
  //             SceneBehaviors.addStoryFlag({
  //               flag: StoryFlag.DEFEATED_BETH,
  //             }),
  //             SceneBehaviors.textMessage({
  //               text: "You crushed me like a weak pepper",
  //               faceHero: true,
  //             }),
  //             // SceneBehaviors.textMessage({ text: "Go away." }),
  //             // SceneBehaviors.walk({ direction: "up", who: "hero" }),
  //           ],
  //         },
  //       ],
  //     }),
  //     npcB: new Character({
  //       x: withGrid(8),
  //       y: withGrid(5),
  //       spriteName: "erio",
  //       talking: [
  //         {
  //           events: [
  //             SceneBehaviors.textMessage({
  //               text: "Bahahaha!",
  //               faceHero: true,
  //             }),
  //             SceneBehaviors.addStoryFlag({
  //               flag: StoryFlag.TALKED_TO_ERIO,
  //             }),
  //             // SceneBehaviors.battle({
  //             //   enemyId: "erio",
  //             // }),
  //           ],
  //         },
  //       ],
  //     }),

  //     pizzaStone: new PizzaStone({
  //       x: withGrid(2),
  //       y: withGrid(7),
  //       storyFlag: StoryFlag.USED_PIZZA_STONE,
  //       pizzas: ["v001", "f001", "s001"],
  //     }),
  //   },
  //   walls: {
  //     [asGridCoords(7, 6)]: true,
  //     [asGridCoords(8, 6)]: true,
  //     [asGridCoords(7, 7)]: true,
  //     [asGridCoords(8, 7)]: true,
  //   },
  //   triggerSpaces: {
  //     [asGridCoords(7, 4)]: [
  //       {
  //         events: [
  //           SceneBehaviors.walk({ direction: "left", who: "npcB" }),
  //           SceneBehaviors.stand({ direction: "up", who: "npcB" }),
  //           SceneBehaviors.textMessage({ text: "You can't be in there!" }),
  //           SceneBehaviors.walk({ direction: "right", who: "npcB" }),
  //           SceneBehaviors.stand({ direction: "down", who: "npcB" }),
  //           SceneBehaviors.walk({ direction: "down", who: "hero" }),
  //           SceneBehaviors.walk({ direction: "left", who: "hero" }),
  //         ],
  //       },
  //     ],
  //     [asGridCoords(5, 10)]: [
  //       {
  //         events: [SceneBehaviors.changeScene({ scene: "Kitchen" })],
  //       },
  //     ],
  //   },
  // },
  Kitchen: {
    id: "Kitchen",
    backgroundSrc: "/images/maps/KitchenLower.png",
    foregroundSrc: "/images/maps/KitchenUpper.png",
    entityConfigs: {
      hero: {
        type: EntityType.Character,
        x: withGrid(5),
        y: withGrid(5),
        spriteName: "hero",
        isPlayerControlled: true,
      },
      npcA: {
        type: EntityType.Character,
        x: withGrid(10),
        y: withGrid(8),
        spriteName: "npc3",
        talking: [
          {
            events: [
              SceneBehaviors.textMessage({
                text: "Why hello there!",
                faceHero: true,
              }),
              SceneBehaviors.stand({
                direction: "down",
              }),
            ],
          },
        ],
      },
      npcC: {
        type: EntityType.Character,
        x: withGrid(2),
        y: withGrid(5),
        spriteName: "npc2",
        behaviorLoop: [
          SceneBehaviors.walk({
            direction: "down",
          }),
          SceneBehaviors.walk({
            direction: "down",
          }),
          SceneBehaviors.stand({
            direction: "down",
            time: 800,
          }),
          SceneBehaviors.stand({
            direction: "left",
            time: 800,
          }),
          SceneBehaviors.stand({
            direction: "right",
            time: 800,
          }),
          SceneBehaviors.walk({
            direction: "up",
          }),
          SceneBehaviors.walk({
            direction: "up",
          }),
          SceneBehaviors.stand({
            direction: "up",
            time: 800,
          }),
          SceneBehaviors.stand({
            direction: "left",
            time: 800,
          }),
          SceneBehaviors.stand({
            direction: "right",
            time: 800,
          }),
        ],
      },
    },
    triggerSpaces: {
      [asGridCoords(5, 10)]: [
        {
          events: [
            SceneBehaviors.changeScene({
              scene: "Street",
              heroInitialState: {
                x: withGrid(29),
                y: withGrid(9),
                direction: "down",
              },
            }),
          ],
        },
      ],
    },
  },
  // Street: {
  //   id: "Street",
  //   backgroundSrc: "/images/maps/StreetLower.png",
  //   foregroundSrc: "/images/maps/StreetUpper.png",
  //   entities: {
  //     hero: new Character({
  //       isPlayerControlled: true,
  //       x: withGrid(29),
  //       y: withGrid(10),
  //       spriteName: "hero",
  //     }),
  //   },
  //   triggerSpaces: {
  //     [asGridCoords(29, 9)]: [
  //       {
  //         events: [
  //           SceneBehaviors.changeScene({
  //             scene: "Kitchen",
  //             heroInitialState: {
  //               x: withGrid(5),
  //               y: withGrid(10),
  //               direction: "up",
  //             },
  //           }),
  //         ],
  //       },
  //     ],
  //   },
  // },
};
