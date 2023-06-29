import { GameObject } from "./GameObject";
import {
  CAMERA_NUDGE_X,
  CAMERA_NUDGE_Y,
  CHAR_OFFSET_X,
  CHAR_OFFSET_Y,
  SPRITE_SIZE,
} from "./constants";
import { Animations } from "./types";
import { withGrid } from "./utils/withGrid";

export interface SpriteConfig {
  animations?: Animations;
  animationFrameLimit?: number;
  currentAnimation?: string;
  src: string;
  gameObject: GameObject;
  useShadow?: boolean;
}

export class Sprite {
  animations: Animations;
  currentAnimation: string;
  currentAnimationFrame = 0;
  animationFrameLimit = 8;
  animationFrameProgress = 0;

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
    this.currentAnimation = config.currentAnimation ?? "idle-down";

    this.animationFrameLimit =
      config.animationFrameLimit ?? this.animationFrameLimit;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: string) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the count
    this.animationFrameProgress = this.animationFrameLimit;

    this.currentAnimationFrame++;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    const x =
      this.gameObject.x -
      CHAR_OFFSET_X +
      withGrid(CAMERA_NUDGE_X) -
      cameraPerson.x;

    const y =
      this.gameObject.y -
      CHAR_OFFSET_Y +
      withGrid(CAMERA_NUDGE_Y) -
      cameraPerson.y;

    if (this.isShadowLoaded) {
      ctx.drawImage(this.shadow, x, y, SPRITE_SIZE, SPRITE_SIZE);
    }

    if (this.isLoaded) {
      const [frameX, frameY] = this.frame;

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
}
