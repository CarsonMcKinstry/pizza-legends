import { GameObject } from "./GameObject";
import {
  CHAR_OFFSET_X,
  CHAR_OFFSET_Y,
  SPRITE_SIZE,
  TILE_SIZE,
} from "./constants";

export type FrameCoords = [number, number];

export type Animations = Record<string, FrameCoords[]>;

export interface SpriteConfig {
  animations?: Animations;
  currentAnimation?: string;
  src: string;
  gameObject: GameObject;
  useShadow?: boolean;
}

export class Sprite {
  animations: Animations;
  currentAnimation: string;
  currentAnimationFrame = 0;

  image: HTMLImageElement;
  shadow: HTMLImageElement;

  gameObject: GameObject;

  isLoaded = false;
  isShadowLoaded = false;

  useShadow = true;

  constructor(config: SpriteConfig) {
    this.useShadow = config.useShadow ?? this.useShadow;
    this.gameObject = config.gameObject;
    this.image = new Image();

    this.image.src = config.src;

    this.image.addEventListener(
      "load",
      () => {
        this.isLoaded = true;
      },
      { once: true }
    );

    this.shadow = new Image();

    this.shadow.addEventListener(
      "load",
      () => {
        this.isShadowLoaded = true;
      },
      { once: true }
    );

    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
    }

    // Configure animation and initial state
    this.animations = config.animations ?? {
      idleDown: [[0, 0]],
    };
    this.currentAnimation = config.currentAnimation ?? "idleDown";
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.gameObject.x * TILE_SIZE - CHAR_OFFSET_X;
    const y = this.gameObject.y * TILE_SIZE - CHAR_OFFSET_Y;

    if (this.isShadowLoaded) {
      ctx.drawImage(this.shadow, x, y, SPRITE_SIZE, SPRITE_SIZE);
    }

    if (this.isLoaded) {
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
}
