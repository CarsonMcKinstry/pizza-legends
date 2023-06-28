import { GameObject } from "./GameObject";

// Overworld map

export interface SceneControllerConfig {
  gameObjects: Record<string, GameObject>;
  lowerSrc: string;
  upperSrc: string;
}

export class SceneController {
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;

  lowerImageLoaded = false;
  upperImageLoaded = false;

  constructor(config: SceneControllerConfig) {
    this.gameObjects = config.gameObjects;

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

  // Turn these into layers?
  drawLowerImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

export interface SceneConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: Record<string, GameObject>;
}
