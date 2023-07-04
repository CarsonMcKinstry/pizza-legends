import { Entity } from "./Entity";
import { loadImage } from "./utils";

type SceneControllerConfig = {
  entities: Record<string, Entity>;
  backgroundSrc: string;
  foregroundSrc: string;
};

export type SceneConfig = SceneControllerConfig;

export class SceneController {
  entities: Record<string, Entity>;

  // The Map
  background?: HTMLImageElement;
  foreground?: HTMLImageElement;

  constructor({
    entities,
    backgroundSrc,
    foregroundSrc,
  }: SceneControllerConfig) {
    // Establish entities in the scene
    this.entities = entities;

    this.loadGround(backgroundSrc, foregroundSrc);
  }

  private async loadGround(backgroundSrc: string, foregroundSrc: string) {
    this.background = await loadImage(backgroundSrc);
    this.foreground = await loadImage(foregroundSrc);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.background && this.foreground) {
      ctx.drawImage(this.background, 0, 0);

      for (const entity of Object.values(this.entities)) {
        entity.sprite.draw(ctx);
      }

      ctx.drawImage(this.foreground, 0, 0);
    }
  }
}
