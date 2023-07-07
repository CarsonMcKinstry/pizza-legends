import "@/styles/Battle.css";
import { Combatant, Status } from "./Combatant";
import { Pizzas } from "@/Content/Pizzas";

import { TurnCycle } from "./TurnCycle";
import { BattleEvent } from "./BattleEvent";

import React, { JSX } from "jsx-dom";

export type Team = "player" | "enemy";

type BattleConfig = {
  onComplete: () => void;
};

export type BattleState = {
  activeCombatants: {
    player?: string;
    enemy?: string;
  };
};

export class Battle {
  element?: JSX.Element;
  onComplete: () => void;
  combatants: Record<string, Combatant>;
  turnCycle?: TurnCycle;

  activeCombatants: Record<Team, string>;

  container: HTMLElement = document.querySelector(
    ".game-container"
  ) as HTMLElement;

  constructor(config: BattleConfig) {
    this.onComplete = config.onComplete;
    this.combatants = {
      player1: new Combatant(
        {
          ...Pizzas["s001"],
          team: "player",
          state: {
            hp: 25,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: {
              type: Status.Saucy,
              expiresIn: 3,
            },
          },
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...Pizzas["v001"],
          team: "enemy",
          state: {
            hp: 25,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: {
              type: Status.Clumsy,
              expiresIn: 3,
            },
          },
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...Pizzas["f001"],
          team: "enemy",
          state: {
            hp: 50,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
          },
        },
        this
      ),
    };
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy1",
    };
  }

  createElement() {
    this.element = (
      <div className="Battle">
        <div className="Battle_hero">
          <img src="/images/characters/people/hero.png" alt="Hero" />
        </div>
        <div className="Battle_enemy">
          <img src="/images/characters/people/npc3.png" alt="Enemy" />
        </div>
      </div>
    );
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);

      for (const [key, combatant] of Object.entries(this.combatants)) {
        combatant.id = key;

        combatant.init(this.element);
      }

      this.turnCycle = new TurnCycle({
        battle: this,
        onNewEvent: async (event) => {
          return new Promise((resolve) => {
            const battleEvent = new BattleEvent({
              battle: this,
              event,
            });

            battleEvent.init(resolve);
          });
        },
      });

      this.turnCycle.init();
    }
  }
}
