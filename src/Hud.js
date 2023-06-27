import { Combatant } from "./Battle/Combatant";
import { Pizzas } from "./Content/pizzas";
import { playerState } from "./State/PlayerState";
import "./styles/Hud.css";

export class Hud {
  constructor() {
    this.scoreboards = [];
  }

  update() {
    for (const scoreboard of this.scoreboards) {
      scoreboard.update(playerState.pizzas[scoreboard.id]);
    }
  }

  createElement() {
    if (this.element) {
      this.element.remove();
      this.scoreboards = [];
    }

    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    playerState.lineup.forEach((key) => {
      const pizza = playerState.pizzas[key];

      const scoreboard = new Combatant(
        {
          id: key,
          ...Pizzas[pizza.pizzaId],
          ...pizza,
        },
        null
      );
      scoreboard.createElement();

      this.scoreboards.push(scoreboard);
      this.element.appendChild(scoreboard.hudElement);
    });

    this.update();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener("PlayerStateUpdated", () => {
      this.update();
    });

    document.addEventListener("LineupChanged", () => {
      this.createElement();
      container.appendChild(this.element);
    });
  }
}
