import { SceneBehaviors } from "./Behaviors/SceneBehaviors";
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

  startScene(scene: string) {
    const sceneConfig = Scenes[scene];

    this.scene?.cleanup();
    const newScene = new SceneController(sceneConfig);

    newScene.game = this;
    newScene.mountEntities();

    this.scene = newScene;
  }

  async init() {
    this.startScene("DemoRoom");

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.scene?.startCutscene([SceneBehaviors.battle()]);
  }
}
