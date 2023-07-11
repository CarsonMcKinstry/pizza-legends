import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";
import { Character } from "./Entities/Character";
import { fromEntityConfig } from "./Entities/types";
import { Entity, EntityStateUpdate } from "./Entity";
import { Game } from "./Game";
import { SceneEvent } from "./SceneEvent";
import { SceneConfig, SceneEntityConfig } from "./Scenes/types";
import { playerState } from "./State/PlayerState";
import { CAMERA_NUDGE_X, CAMERA_NUDGE_Y } from "./constants";
import { BattleOutcome, Direction, TriggerSpaces } from "./types";
import { loadImage, nextPosition, withGrid } from "./utils";

export class SceneController {
  entities: Record<string, Entity<any>> = {};
  entityConfigs: Record<string, SceneEntityConfig>;

  // The Map
  background?: HTMLImageElement;
  foreground?: HTMLImageElement;

  // The Camera
  camera?: Entity<any>;

  // Walls
  walls: Record<string, true> = {};

  // Cutscene State
  isCutscenePlaying = false;
  triggerSpaces: TriggerSpaces = {};

  container: HTMLElement = document.querySelector(
    ".game-container"
  ) as HTMLElement;

  game?: Game;

  isPaused = false;

  constructor({
    entityConfigs,
    backgroundSrc,
    foregroundSrc,
    walls,
    triggerSpaces,
  }: SceneConfig) {
    this.entityConfigs = entityConfigs;

    this.loadGround(backgroundSrc, foregroundSrc);

    this.camera = this.entities.hero;

    this.walls = walls ?? this.walls;
    this.triggerSpaces = triggerSpaces ?? this.triggerSpaces;
  }

  mountEntities() {
    for (const [id, entity] of Object.entries(this.entityConfigs)) {
      const instance = fromEntityConfig(entity.type, entity);
      instance.mount(this, id);

      this.entities[id] = instance;
    }
  }

  cleanup() {
    for (const entity of Object.values(this.entities)) {
      entity.unmount();
    }
    this.entities = {};
  }

  isSpaceTaken(currentX: number, currentY: number, direction: Direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) return true;

    for (const entity of Object.values(this.entities)) {
      if (entity.x === x && entity.y === y) return true;
      if (
        entity instanceof Character &&
        entity.intentPosition &&
        entity.intentPosition.x === x &&
        entity.intentPosition.y === y
      ) {
        return true;
      }
    }

    return false;
  }

  async startCutscene(events: SceneBehaviorType[]) {
    this.isCutscenePlaying = true;
    for (const event of events) {
      const eventHandler = new SceneEvent({
        scene: this,
        event,
      });
      const result = await eventHandler.init();

      if (typeof result === "string" && result === BattleOutcome.Lose) {
        break;
      }
    }

    this.isCutscenePlaying = false;
  }

  async loadGround(backgroundSrc: string, foregroundSrc: string) {
    this.background = await loadImage(backgroundSrc);
    this.foreground = await loadImage(foregroundSrc);
  }

  update(updates: EntityStateUpdate) {
    for (const entity of Object.values(this.entities)) {
      entity.update(updates);
    }
    if (updates.camera) {
      this.camera = updates.camera;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.background && this.foreground) {
      this.drawImage(ctx, this.background);
      for (const entity of Object.values(this.entities).sort(
        (a, b) => a.y - b.y
      )) {
        entity.sprite.draw(ctx, this.camera!);
      }
      this.drawImage(ctx, this.foreground);
    }
  }

  drawImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    ctx.drawImage(
      image,
      withGrid(CAMERA_NUDGE_X) - this.camera!.x,
      withGrid(CAMERA_NUDGE_Y) - this.camera!.y
    );
  }

  checkForFootstepCutscene() {
    const hero = this.entities["hero"];
    const match = this.triggerSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  checkForActionCutscene() {
    const hero = this.entities["hero"];

    if (hero) {
      const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.entities).find((entity) => {
        return `${entity.x},${entity.y}` === `${nextCoords.x},${nextCoords.y}`;
      });

      if (!this.isCutscenePlaying && match && match.talking?.length) {
        const relevantScenario = match.talking.find((scenario) => {
          return (scenario.requires ?? []).every(
            (item) => playerState.storyFlags[item]
          );
        });
        if (relevantScenario) {
          this.startCutscene(
            relevantScenario.events.map(
              (event) =>
                ({
                  ...event,
                  details: {
                    ...(event.details ?? {}),
                    who:
                      event.details! && "who" in event.details
                        ? event.details.who
                        : match.id,
                  },
                } as SceneBehaviorType)
            )
          );
        }
      }
    }
  }
}
