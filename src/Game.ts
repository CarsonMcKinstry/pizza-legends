import { Entity } from "./Entity";
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

    const hero = new Entity({
      x,
      y,
    });

    const npc1 = new Entity({
      x: 7,
      y: 9,
      src: "/images/characters/people/npc1.png",
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc1.sprite.draw(this.ctx);
    }, 200);
  }
}
