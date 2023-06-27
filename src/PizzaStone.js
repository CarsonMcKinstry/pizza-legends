import { GameObject } from "./GameObject";
import { Sprite } from "./Sprite";
import { playerState } from "./State/PlayerState";
import PizzaStoneSprite from "./images/characters/pizza-stone.png";

export class PizzaStone extends GameObject {
  constructor(config) {
    super(config);

    this.sprite = new Sprite({
      gameObject: this,
      src: PizzaStoneSprite,
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
          {
            type: "textMessage",
            text: "You have already used this.",
          },
        ],
      },
      {
        events: [
          {
            type: "textMessage",
            text: "Approaching the legendary stone...",
          },
          {
            type: "craftingMenu",
            pizzas: this.pizzas,
          },
          {
            type: "addStoryFlag",
            flag: this.storyFlag,
          },
        ],
      },
    ];
  }

  update() {
    this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
      ? "used-down"
      : "unused-down";
  }
}
