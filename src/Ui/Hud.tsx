import { Combatant } from "@/Battle/Combatant";
import { Pizzas } from "@/Content/Pizzas";
import { globalEvents } from "@/Inputs/GlobalEvents";
import { playerState } from "@/State/PlayerState";
import "@/styles/Hud.css";
import React, { JSX } from "jsx-dom";

export class Hud {
  element?: JSX.Element;

  scoreBoards: Combatant[] = [];

  update() {
    for (const scoreBoard of Object.values(this.scoreBoards)) {
      scoreBoard.update(playerState.pizzas[scoreBoard.id!]);
    }
  }

  createScoreboards() {
    return playerState.lineup.map((key) => {
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

  createElement() {
    if (this.element) {
      this.element?.remove();
      this.scoreBoards = [];
    }
    this.scoreBoards = this.createScoreboards();
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

    globalEvents.on("LineupChanged", () => {
      this.createElement();
      container.appendChild(this.element!);
    });
  }
}
