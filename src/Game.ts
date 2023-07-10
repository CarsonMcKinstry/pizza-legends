import { SceneBehaviors } from "./Behaviors/SceneBehaviors";
import { DirectionInput } from "./Inputs/DirectionInput";
import { globalEvents } from "./Inputs/GlobalEvents";
import { KeyPressListener } from "./Inputs/KeyPressListener";
import { Progress } from "./Progress";
import { SceneController } from "./SceneController";
import { Scenes } from "./Scenes";
import { Hud } from "./Ui/Hud";
import { Direction, HeroInitialState } from "./types";

export type GameConfig = {
  element: HTMLElement;
};

export class Game {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  scene?: SceneController;

  directionInput?: DirectionInput;

  hud?: Hud;

  progress?: Progress;

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

      if (!this.scene!.isPaused) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.scene?.checkForActionCutscene();
    });

    new KeyPressListener("Escape", () => {
      if (!this.scene?.isCutscenePlaying) {
        this.scene?.startCutscene([SceneBehaviors.pause()]);
      }
    });
  }

  bindHeroPositionCheck() {
    globalEvents.on("PersonWalkingComplete", ({ detail }) => {
      if (detail.whoId === "hero") {
        this.scene?.checkForFootstepCutscene();
      }
    });
  }

  startScene(scene: string, heroInitialState?: HeroInitialState) {
    const sceneConfig = Scenes[scene];

    this.scene?.cleanup();
    const newScene = new SceneController(sceneConfig);

    newScene.game = this;
    newScene.mountEntities();

    this.scene = newScene;

    if (heroInitialState && this.scene?.entities.hero) {
      this.scene!.entities.hero.x = heroInitialState.x;
      this.scene!.entities.hero.y = heroInitialState.y;
      this.scene!.entities.hero.direction = heroInitialState.direction;
    }

    this.progress!.mapId = sceneConfig.id;
    this.progress!.startingHeroX = this.scene!.entities.hero.x;
    this.progress!.startingHeroY = this.scene!.entities.hero.y;
    this.progress!.startingHeroDirection = this.scene!.entities.hero.direction;
  }

  async init() {
    // Create a new progress tracker
    this.progress = new Progress();

    // Potentially load saved data
    let initialHeroState: HeroInitialState | undefined = undefined;
    const saveFile = this.progress.getSaveFile();

    if (saveFile) {
      this.progress.load();

      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      };
    }

    // Load the HUD
    this.hud = new Hud();
    this.hud.init(this.element);

    // Start the map
    this.startScene(this.progress.mapId, initialHeroState);

    // Create controls
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
