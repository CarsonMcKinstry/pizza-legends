import { GameObject } from "./GameObject";
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

    // Place some game objects!
    const hero = new GameObject({
      x: 5,
      y: 6,
    });
    const npc1 = new GameObject({
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
