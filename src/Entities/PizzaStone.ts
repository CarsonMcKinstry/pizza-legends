import { SceneBehaviors } from "@/Behaviors/SceneBehaviors";
import { StoryFlag } from "@/Content/StoryFlags";
import { Entity, EntityConfig, EntityStateUpdate } from "@/Entity";
import { playerState } from "@/State/PlayerState";
import { EntityType } from "./types";

export type PizzaStoneConfig = EntityConfig<EntityType.PizzaStone> & {
  storyFlag: StoryFlag;
  pizzas: string[];
};

export class PizzaStone extends Entity<EntityType.PizzaStone> {
  storyFlag: StoryFlag;
  pizzas: string[];

  constructor(config: PizzaStoneConfig) {
    super({
      ...config,
      src: "/images/characters/pizza-stone.png",
      animations: {
        "used-down": [[0, 0]],
        "unused-down": [[1, 0]],
      },
      currentAnimation: "used-down",
    });

    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;

    this.talking = [
      {
        requires: [this.storyFlag],
        events: [
          SceneBehaviors.textMessage({
            text: "You have already used this.",
          }),
        ],
      },
      {
        events: [
          SceneBehaviors.textMessage({
            text: "Approaching the legendary pizza stone...",
          }),
          SceneBehaviors.craftingMenu({
            pizzas: this.pizzas,
          }),
          SceneBehaviors.addStoryFlag({
            flag: this.storyFlag,
          }),
        ],
      },
    ];
  }

  override update(_state: EntityStateUpdate): void {
    this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
      ? "used-down"
      : "unused-down";
  }
}
