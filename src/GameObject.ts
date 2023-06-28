import { Sprite, SpriteConfig } from "./Sprite";

export interface GameObjectConfig
  extends Omit<SpriteConfig, "src" | "gameObject"> {
  x: number;
  y: number;
  src?: string;
}

export class GameObject {
  x = 0;
  y = 0;
  sprite: Sprite;

  constructor(config: GameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src ?? "/images/characters/people/hero.png",
    });
  }
}
