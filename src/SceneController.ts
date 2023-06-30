import { nextPosition } from "./utils/nextPosition";
import { GameObject } from "./GameObject";
import { CAMERA_NUDGE_X, CAMERA_NUDGE_Y } from "./constants";
import { Direction, TriggerSpaces } from "./types";
import { withGrid } from "./utils/withGrid";
import { Behavior } from "./Behaviors";
import { SceneEvent } from "./SceneEvent";
import { Person } from "./Objects/Person";
import { Game } from "./Game";

// Overworld map

export interface SceneControllerConfig {
  gameObjects: Record<string, GameObject>;
  lowerSrc: string;
  upperSrc: string;
  walls?: Record<string, true>;
  triggerSpaces?: TriggerSpaces;
}

export class SceneController {
  game: Game | null = null;
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;

  lowerImageLoaded = false;
  upperImageLoaded = false;
  walls: Record<string, true> = {};

  isCutscenePlaying = false;

  triggerSpaces: TriggerSpaces = {};

  constructor(config: SceneControllerConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || this.walls;

    this.lowerImage = new Image();

    this.lowerImage.addEventListener("load", () => {
      this.lowerImageLoaded = true;
    });
    this.lowerImage.src = config.lowerSrc;
    this.upperImage = new Image();

    this.upperImage.addEventListener("load", () => {
      this.upperImageLoaded = true;
    });
    this.upperImage.src = config.upperSrc;

    this.triggerSpaces = config.triggerSpaces ?? this.triggerSpaces;
  }

  mountObjects() {
    for (const [key, obj] of Object.entries(this.gameObjects)) {
      obj.mount(this, key);
    }
  }

  isSpaceTaken(currentX: number, currentY: number, direction: Direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) {
      return true;
    }

    for (const obj of Object.values(this.gameObjects)) {
      if (obj.x === x && obj.y === y) return true;
      if (
        obj instanceof Person &&
        obj.intentPosition &&
        obj.intentPosition[0] === x &&
        obj.intentPosition[1] === y
      ) {
        return true;
      }
    }
    return false;
  }

  // Turn these into layers?
  drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    this.drawImage(ctx, cameraPerson, this.lowerImage);
  }

  drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    this.drawImage(ctx, cameraPerson, this.upperImage);
  }

  drawImage(
    ctx: CanvasRenderingContext2D,
    cameraPerson: GameObject,
    image: HTMLImageElement
  ) {
    ctx.drawImage(
      image,
      withGrid(CAMERA_NUDGE_X) - cameraPerson.x,
      withGrid(CAMERA_NUDGE_Y) - cameraPerson.y
    );
  }

  async startCutscene(events: Behavior[]) {
    this.isCutscenePlaying = true;

    for (const event of events) {
      const eventHandler = new SceneEvent({
        scene: this,
        event,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behvior

    for (const obj of Object.values(this.gameObjects)) {
      obj.doBehaviorEvent(this);
    }
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];

    if (hero) {
      const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find((obj) => {
        return `${obj.x},${obj.y}` === `${nextCoords.x},${nextCoords.y}`;
      });

      if (
        !this.isCutscenePlaying &&
        match &&
        match instanceof Person &&
        match.talking.length
      ) {
        this.startCutscene(
          match.talking[0].events.map((event) => ({
            ...event,
            who: "who" in event ? event.who : match.id,
          }))
        );
      }
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.triggerSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }
}
