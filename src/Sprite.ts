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

  frameLimit?: number;
};

const defaultAnimations: SpriteAnimations = {
  "idle-down": [[0, 0]],
  "idle-right": [[0, 1]],
  "idle-up": [[0, 2]],
  "idle-left": [[0, 3]],
  "walk-down": [
    [1, 0],
    [0, 0],
    [3, 0],
    [0, 0],
  ],
  "walk-right": [
    [1, 1],
    [0, 1],
    [3, 1],
    [0, 1],
  ],
  "walk-up": [
    [1, 2],
    [0, 2],
    [3, 2],
    [0, 2],
  ],
  "walk-left": [
    [1, 3],
    [0, 3],
    [3, 3],
    [0, 3],
  ],
};

export class Sprite {
  // Images for the sprite
  image?: HTMLImageElement;
  shadow?: HTMLImageElement;

  // Animations
  animations: SpriteAnimations = defaultAnimations;
  currentAnimation = "idle-down";
  currentFrame = 0;

  frameLimit = 8;
  frameProgress = 0;

  // Entity the sprite belongs to
  entity: Entity;

  constructor(config: SpriteConfig) {
    // Load sprites
    this.loadSprite(config.src, config.useShadow);

    // Setup animations
    this.animations = config.animations ?? this.animations;
    this.currentAnimation = config.currentAnimation ?? this.currentAnimation;

    this.frameLimit = config.frameLimit ?? this.frameLimit;

    // Assign the entity to the sprite
    this.entity = config.entity;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentFrame];
  }

  updateAnimationProgress() {
    if (this.frameProgress > 0) {
      this.frameProgress--;
      return;
    }

    this.frameProgress = this.frameLimit;
    this.currentFrame++;

    if (this.frame === undefined) {
      this.currentFrame = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.entity.x - CHAR_OFFSET_X;
    const y = this.entity.y - CHAR_OFFSET_Y;

    if (this.shadow) {
      ctx.drawImage(this.shadow, x, y, SPRITE_SIZE, SPRITE_SIZE);
    }

    if (this.image) {
      const [frameX, frameY] = this.frame ?? [1, 1];
      ctx.drawImage(
        this.image,
        frameX * SPRITE_SIZE,
        frameY * SPRITE_SIZE,
        SPRITE_SIZE,
        SPRITE_SIZE,
        x,
        y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    }
    this.updateAnimationProgress();
  }

  private async loadSprite(src: string, useShadow?: boolean) {
    this.image = await loadImage(src);

    if (useShadow) {
      this.shadow = await loadImage("/images/character/shadow.png");
    }
  }

  setAnimation(key: string) {
    if (!(key in this.animations)) {
      throw new Error(`Unknown animation key: "${key}"`);
    }
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentFrame = 0;
      this.frameProgress = this.frameLimit;
    }
  }
}
