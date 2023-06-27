import { GameObject } from "./GameObject";
import DemoLower from "./images/maps/DemoLower.png";
import DemoUpper from "./images/maps/DemoUpper.png";
import KitchenLower from "./images/maps/KitchenLower.png";
import KitchenUpper from "./images/maps/KitchenUpper.png";
import Npc1 from "./images/characters/people/npc1.png";
import Npc2 from "./images/characters/people/erio.png";
import Npc3 from "./images/characters/people/npc3.png";
import { Person } from "./Person";
import { asGridCoords, nextPosition, withGrid } from "./utils";
import { OverworldEvent } from "./OverworldEvent";
import { playerState } from "./State/PlayerState";

export const OverworldMaps = {
  DemoRoom: {
    lowerSrc: DemoLower,
    upperSrc: DemoUpper,
    gameObjects: {
      hero: new Person({
        x: withGrid(5),
        y: withGrid(6),
        isPlayerControlled: true,
      }),
      npc1: new Person({
        x: withGrid(7),
        y: withGrid(9),
        src: Npc1,
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "up", time: 300 },
        ],
        talking: [
          {
            requires: ["TALKED_TO_ERIO"],
            events: [
              {
                type: "textMessage",
                text: "Isn't Erio the coolest?",
                faceHero: "npc1",
              },
            ],
          },
          {
            events: [
              {
                type: "textMessage",
                text: "I'm going to crush you!",
                faceHero: "npc1",
              },
              {
                type: "battle",
                enemyId: "beth",
              },
              {
                type: "addStoryFlag",
                flag: "DEFEATED_BETH",
              },
              {
                type: "textMessage",
                text: "You crushed me like weak pepper.",
                faceHero: "npc1",
              },
            ],
          },
        ],
      }),
      npc2: new Person({
        x: withGrid(8),
        y: withGrid(5),
        src: Npc2,
        talking: [
          {
            events: [
              { type: "textMessage", text: "Bahaha!", faceHero: "npc2" },
              {
                type: "addStoryFlag",
                flag: "TALKED_TO_ERIO",
              },
              {
                type: "stand",
                direction: "down",
                who: "npc2",
              },
              // { type: "battle", enemyId: "erio" },
            ],
          },
        ],

        // behaviorLoop: [
        //   { type: "walk", direction: "left" },
        //   { type: "stand", direction: "up", time: 800 },
        //   { type: "walk", direction: "up" },
        //   { type: "walk", direction: "right" },
        //   { type: "walk", direction: "down" }
        // ]
      }),
    },
    walls: {
      [asGridCoords(7, 6)]: true,
      [asGridCoords(8, 6)]: true,
      [asGridCoords(7, 7)]: true,
      [asGridCoords(8, 7)]: true,
    },
    cutsceneSpaces: {
      [asGridCoords(7, 4)]: [
        {
          events: [
            {
              who: "npc2",
              type: "walk",
              direction: "left",
            },
            {
              who: "hero",
              type: "stand",
              direction: "down",
            },
            {
              who: "npc2",
              type: "stand",
              direction: "up",
            },
            {
              type: "textMessage",
              text: "You can't be in there!",
            },
            {
              who: "npc2",
              type: "walk",
              direction: "right",
            },
            {
              who: "npc2",
              type: "stand",
              direction: "down",
            },
            {
              who: "hero",
              type: "walk",
              direction: "down",
            },
            {
              who: "hero",
              type: "walk",
              direction: "left",
            },
          ],
        },
      ],
      [asGridCoords(5, 10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
            },
          ],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: KitchenLower,
    upperSrc: KitchenUpper,
    gameObjects: {
      hero: new Person({
        x: withGrid(5),
        y: withGrid(5),
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: withGrid(9),
        y: withGrid(6),
        src: Npc2,
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "You made it!",
                faceHero: "npcA",
              },
              {
                who: "npcA",
                type: "stand",
                direction: "down",
              },
            ],
          },
        ],
      }),
      // npcB: new Person({ x: withGrid(10), y: withGrid(8), src: Npc3 })
    },
  },
};

export class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);

    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      // TODO: determine if this object should actually mount
      let object = this.gameObjects[key];
      object.id = key;

      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (const event of events) {
      const eventHandler = new OverworldEvent({
        event,
        map: this,
      });
      const result = await eventHandler.init();

      if (result === "LOST_BATTLE") {
        break;
      }
    }

    this.isCutscenePlaying = false;

    // Reset NPCS to idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);

    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.requires || []).every((sf) => {
          return playerState.storyFlags[sf];
        });
      });

      if (relevantScenario) {
        this.startCutscene(relevantScenario.events);
      }
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }
}
