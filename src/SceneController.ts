import { nextPosition } from "./utils/nextPosition";
import { GameObject } from "./GameObject";
import { CAMERA_NUDGE_X, CAMERA_NUDGE_Y } from "./constants";
import { Direction } from "./types";
import { withGrid } from "./utils/withGrid";

// Overworld map

export interface SceneControllerConfig {
  gameObjects: Record<string, GameObject>;
  lowerSrc: string;
  upperSrc: string;
  walls?: Record<string, true>;
}

export class SceneController {
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;

  lowerImageLoaded = false;
  upperImageLoaded = false;
  walls: Record<string, true> = {};

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
  }

  mountObjects() {
    for (const obj of Object.values(this.gameObjects)) {
      obj.mount(this);
    }
  }

  isSpaceTaken(currentX: number, currentY: number, direction: Direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] ?? false;
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

  addWall(x: number, y: number) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x: number, y: number) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX: number, wasY: number, direction: Direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

export interface SceneConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: Record<string, GameObject>;
  walls: Record<string, true>;
}
