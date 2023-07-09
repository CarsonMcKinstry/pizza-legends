import { Combatant } from "@/Battle/Combatant";
import { Pizzas } from "@/Content/Pizzas";
import { globalEvents } from "@/Inputs/GlobalEvents";
import { playerState } from "@/State/PlayerState";
import "@/styles/Hud.css";
import React, { JSX } from "jsx-dom";

export class Hud {
  element?: JSX.Element;

  scoreBoards: Combatant[];

  constructor() {
    this.scoreBoards = playerState.lineup.map((key) => {
      const { pizzaId, ...combatantState } = playerState.pizzas[key];

      const scoreboard = new Combatant({
        ...Pizzas[pizzaId],
        state: combatantState,
      });

      scoreboard.id = key;
      scoreboard.createElement();
      return scoreboard;
    });
  }

  update() {
    for (const scoreBoard of Object.values(this.scoreBoards)) {
      scoreBoard.update(playerState.pizzas[scoreBoard.id!]);
    }
  }

  createElement() {
    this.element = (
      <div className="Hud">
        {this.scoreBoards.map((scoreBoard) => scoreBoard.hudElement)}
      </div>
    );
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }

    globalEvents.on("PlayerStateUpdated", () => {
      this.update();
    });
  }
}
