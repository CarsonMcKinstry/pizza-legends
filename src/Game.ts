import { SceneController } from "./SceneController";
import { Scenes } from "./Scenes";
import { DirectionInput } from "./Inputs/DirectionInput";

interface GameConfig {
  element: HTMLElement;
}

export class Game {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: SceneController | null;

  directionInput: DirectionInput | null = null;

  constructor(config: GameConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(
      ".game-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.scene = null;
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.scene) {
        this.scene.drawLowerImage(this.ctx);

        for (const obj of Object.values(this.scene.gameObjects)) {
          obj.update({
            lastPressed: this.directionInput?.direction,
            directionsHeld: this.directionInput?.directionsHeld,
          });
          obj.sprite.draw(this.ctx);
        }

        this.scene.drawUpperImage(this.ctx);
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  init() {
    this.scene = new SceneController(Scenes.DemoRoom);

    this.directionInput = new DirectionInput();

    this.directionInput.init();

    this.startGameLoop();
  }
}
