import { DirectionInput } from "./Inputs/DirectionInput";
import { globalEvents } from "./Inputs/GlobalEvents";
import { KeyPressListener } from "./Inputs/KeyPressListener";
import { SceneController } from "./SceneController";
import { Scenes } from "./Scenes";

export type GameConfig = {
  element: HTMLElement;
};

export class Game {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  scene?: SceneController;

  directionInput?: DirectionInput;

  constructor(config: GameConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(
      ".game-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.scene) {
        const camera = this.scene.entities.hero;

        this.scene.update({
          directionInput: this.directionInput!,
          camera,
          scene: this.scene!,
        });

        this.scene.draw(this.ctx);
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.scene?.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    globalEvents.on("PersonWalkingComplete", ({ detail }) => {
      if (detail.whoId === "hero") {
        this.scene?.checkForFootstepCutscene();
      }
    });
  }

  async init() {
    this.scene = new SceneController(Scenes.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.scene.mountEntities();

    this.startGameLoop();

    // this.scene.startCutscene([
    //   SceneBehaviors.walk({
    //     direction: "down",
    //     who: "hero",
    //   }),
    //   SceneBehaviors.walk({
    //     direction: "down",
    //     who: "hero",
    //   }),
    //   SceneBehaviors.walk({
    //     direction: "left",
    //     who: "npc1",
    //   }),
    //   SceneBehaviors.walk({
    //     direction: "left",
    //     who: "npc1",
    //   }),
    //   SceneBehaviors.stand({
    //     direction: "up",
    //     who: "npc1",
    //   }),
    // ]);
  }
}
