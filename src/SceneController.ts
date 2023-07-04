import { Entity, EntityStateUpdate } from "./Entity";
import { CAMERA_NUDGE_X, CAMERA_NUDGE_Y } from "./constants";
import { Direction } from "./types";
import { loadImage, nextPosition, withGrid } from "./utils";

type SceneControllerConfig = {
  entities: Record<string, Entity>;
  backgroundSrc: string;
  foregroundSrc: string;
  walls: Record<string, true>;
};

export type SceneConfig = SceneControllerConfig;

export class SceneController {
  entities: Record<string, Entity>;

  // The Map
  background?: HTMLImageElement;
  foreground?: HTMLImageElement;

  // The Camera
  camera?: Entity;

  walls: Record<string, true> = {};

  constructor({
    entities,
    backgroundSrc,
    foregroundSrc,
    walls,
  }: SceneControllerConfig) {
    // Establish entities in the scene
    this.entities = entities;

    this.loadGround(backgroundSrc, foregroundSrc);

    this.camera = entities.hero;

    this.walls = walls ?? this.walls;
  }

  mountEntities() {
    for (const [id, entity] of Object.entries(this.entities)) {
      entity.mount(id);
    }
  }

  isSpaceTaken(currentX: number, currentY: number, direction: Direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] ?? false;
  }

  private async loadGround(backgroundSrc: string, foregroundSrc: string) {
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
      for (const entity of Object.values(this.entities)) {
        entity.sprite.draw(ctx, this.camera!);
      }
      this.drawImage(ctx, this.foreground);
    }
  }

  private drawImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    ctx.drawImage(
      image,
      withGrid(CAMERA_NUDGE_X) - this.camera!.x,
      withGrid(CAMERA_NUDGE_Y) - this.camera!.y
    );
  }
}
