import {
  CHAR_OFFSET_X,
  CHAR_OFFSET_Y,
  SPRITE_SIZE,
  TILE_SIZE,
} from "./constants";
import { loadImage } from "./utils";

export type GameConfig = {
  element: HTMLElement;
};

export class Game {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(config: GameConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(
      ".game-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  async init() {
    const image = await loadImage("/images/maps/DemoLower.png");

    this.ctx.drawImage(image, 0, 0);

    const x = 5;
    const y = 5;

    const hero = await loadImage("/images/characters/people/hero.png");

    this.ctx.drawImage(
      hero,
      0,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      x * TILE_SIZE - CHAR_OFFSET_X,
      y * TILE_SIZE - CHAR_OFFSET_Y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

    const shadow = await loadImage("/images/characters/shadow.png");

    this.ctx.drawImage(
      shadow,
      0,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      x * TILE_SIZE - CHAR_OFFSET_X,
      y * TILE_SIZE - CHAR_OFFSET_Y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }
}
