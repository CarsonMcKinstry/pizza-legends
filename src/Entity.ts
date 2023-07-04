import { Sprite, SpriteConfig } from "./Sprite";

export type EntityConfig = Omit<SpriteConfig, "src" | "entity"> & {
  x: number;
  y: number;
  src?: string;
};

export class Entity {
  x = 0;
  y = 0;
  sprite: Sprite;

  constructor({ x, y, src, ...spriteConfig }: EntityConfig) {
    this.x = x;
    this.y = y;

    this.sprite = new Sprite({
      entity: this,
      src: src ?? "/images/characters/people/hero.png",
      ...spriteConfig,
    });
  }
}
