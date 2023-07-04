import { Entity } from "./Entity";
import { CHAR_OFFSET_X, CHAR_OFFSET_Y, SPRITE_SIZE } from "./constants";
import { loadImage } from "./utils";

export type SpriteFrameCoords = [number, number];

export type SpriteAnimations = Record<string, SpriteFrameCoords[]>;

export type SpriteConfig = {
  entity: Entity;
  src: string;
  useShadow?: boolean;
  animations?: SpriteAnimations;
  currentAnimation?: string;
};

export class Sprite {
  // Images for the sprite
  image?: HTMLImageElement;
  shadow?: HTMLImageElement;

  // Animations
  animations: SpriteAnimations = {};
  currentAnimation = "idle-down";
  currentFrame = 0;

  // Entity the sprite belongs to
  entity: Entity;

  constructor(config: SpriteConfig) {
    // Load sprites
    this.loadSprite(config.src, config.useShadow);

    // Setup animations
    this.animations = config.animations ?? {
      "idle-down": [[0, 0]],
    };
    this.currentAnimation = config.currentAnimation ?? this.currentAnimation;

    // Assign the entity to the sprite
    this.entity = config.entity;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.entity.x - CHAR_OFFSET_X;
    const y = this.entity.y - CHAR_OFFSET_Y;

    if (this.shadow) {
      ctx.drawImage(this.shadow, x, y, SPRITE_SIZE, SPRITE_SIZE);
    }

    if (this.image) {
      ctx.drawImage(
        this.image,
        0,
        0,
        SPRITE_SIZE,
        SPRITE_SIZE,
        x,
        y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    }
  }

  private async loadSprite(src: string, useShadow?: boolean) {
    this.image = await loadImage(src);

    if (useShadow) {
      this.shadow = await loadImage("/images/character/shadow.png");
    }
  }
}
