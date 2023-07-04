import { Sprite, SpriteConfig } from "@/Sprite";
import { Direction } from "@/types";
import { DirectionInput } from "@/Inputs/DirectionInput";
import { SceneController } from "@/SceneController";

export type EntityConfig = Omit<SpriteConfig, "src" | "entity"> & {
  x: number;
  y: number;
  src?: string;
  direction?: Direction;
};

export type EntityStateUpdate = {
  directionInput: DirectionInput;
  scene: SceneController;
  camera?: Entity;
};

export class Entity {
  private _id?: string;
  x = 0;
  y = 0;
  sprite: Sprite;
  direction: Direction = "down";
  isMounted = false;
  isStanding = false;

  constructor({ x, y, src, direction, ...spriteConfig }: EntityConfig) {
    this.x = x;
    this.y = y;
    this.direction = direction ?? this.direction;
    this.sprite = new Sprite({
      entity: this,
      src: src ?? "/images/characters/people/hero.png",
      ...spriteConfig,
    });
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }

  update(_state: EntityStateUpdate) {}

  mount(id: string) {
    this.id = id;
    this.isMounted = true;
  }

  isBehaviorReady() {
    return true;
  }
}
