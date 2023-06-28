import {
  CHAR_OFFSET_X,
  CHAR_OFFSET_Y,
  SPRITE_SIZE,
  TILE_SIZE,
} from "./constants";

interface GameConfig {
  element: HTMLElement;
}

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

  init() {
    const image = new Image();

    image.addEventListener(
      "load",
      () => {
        this.ctx.drawImage(image, 0, 0);
      },
      { once: true }
    );

    image.src = "/images/maps/DemoLower.png";

    const x = 5;
    const y = 6;
    const hero = new Image();
    hero.addEventListener("load", () => {
      this.ctx.drawImage(
        hero,
        0, // left cut
        0, // right cut
        SPRITE_SIZE, // width of cut
        SPRITE_SIZE, // height of cut
        x * TILE_SIZE - CHAR_OFFSET_X, // position x
        y * TILE_SIZE - CHAR_OFFSET_Y, // position y
        SPRITE_SIZE, // width at position
        SPRITE_SIZE // height at position
      );
    });
    hero.src = "/images/characters/people/hero.png";

    const shadow = new Image();
    shadow.addEventListener("load", () => {
      this.ctx.drawImage(
        shadow,
        0, // left cut
        0, // right cut
        SPRITE_SIZE, // width of cut
        SPRITE_SIZE, // height of cut
        x * TILE_SIZE - CHAR_OFFSET_X, // position x
        y * TILE_SIZE - CHAR_OFFSET_Y, // position y
        SPRITE_SIZE, // width at position
        SPRITE_SIZE // height at position
      );
    });
    shadow.src = "/images/characters/shadow.png";
  }
}
