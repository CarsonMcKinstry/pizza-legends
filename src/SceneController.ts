import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";
import { Character } from "./Entities/Character";
import { Entity, EntityStateUpdate } from "./Entity";
import { Game } from "./Game";
import { SceneEvent } from "./SceneEvent";
import { playerState } from "./State/PlayerState";
import { CAMERA_NUDGE_X, CAMERA_NUDGE_Y } from "./constants";
import { BattleOutcome, Direction, TriggerSpaces } from "./types";
import { loadImage, nextPosition, withGrid } from "./utils";

type SceneControllerConfig = {
  entities: Record<string, Entity>;
  backgroundSrc: string;
  foregroundSrc: string;
  walls?: Record<string, true>;
  triggerSpaces?: TriggerSpaces;
};

export type SceneConfig = SceneControllerConfig;

export class SceneController {
  entities: Record<string, Entity>;

  // The Map
  background?: HTMLImageElement;
  foreground?: HTMLImageElement;

  // The Camera
  camera?: Entity;

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
    entities,
    backgroundSrc,
    foregroundSrc,
    walls,
    triggerSpaces,
  }: SceneControllerConfig) {
    // Establish entities in the scene
    this.entities = entities;

    this.loadGround(backgroundSrc, foregroundSrc);

    this.camera = entities.hero;

    this.walls = walls ?? this.walls;
    this.triggerSpaces = triggerSpaces ?? this.triggerSpaces;
  }

  mountEntities() {
    for (const [id, entity] of Object.entries(this.entities)) {
      entity.mount(this, id);
    }
  }

  cleanup() {
    for (const entity of Object.values(this.entities)) {
      entity.dismount();
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
