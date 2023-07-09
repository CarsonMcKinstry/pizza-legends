import "@/styles/Battle.css";
import { Combatant } from "./Combatant";
import { Pizzas } from "@/Content/Pizzas";

import { TurnCycle } from "./TurnCycle";
import { BattleEvent } from "./BattleEvent";

import React, { JSX } from "jsx-dom";
import { CombatantState, Enemy, Item, TeamType } from "@/types";
import { Team } from "./Team";
import { playerState } from "@/State/PlayerState";

type BattleConfig = {
  enemy: Enemy;
  onComplete: (winner: TeamType) => void;
};

export type BattleState = {
  activeCombatants: {
    player?: string;
    enemy?: string;
  };
};

export class Battle {
  element?: JSX.Element;
  onComplete: (winner: TeamType) => void;
  combatants: Record<string, Combatant> = {};
  turnCycle?: TurnCycle;

  activeCombatants: Partial<Record<TeamType, string>> = {};

  container: HTMLElement = document.querySelector(
    ".game-container"
  ) as HTMLElement;

  items: Item[] = [];

  playerTeam?: Team;
  enemyTeam?: Team;

  enemy: Enemy;

  usedInstanceIds: Record<string, true> = {};

  constructor(config: BattleConfig) {
    this.onComplete = config.onComplete;
    this.enemy = config.enemy;

    for (const combatantId of playerState.lineup) {
      const combatantState = playerState.pizzas[combatantId];

      this.addCombatant(combatantId, combatantState, "player");
    }

    for (const [combatantId, combatantState] of Object.entries(
      this.enemy.pizzas
    )) {
      this.addCombatant(combatantId, combatantState, "enemy");
    }

    this.items = playerState.items.map((item) => ({
      ...item,
      team: "player",
    }));
  }

  addCombatant(
    id: string,
    state: Partial<CombatantState> & { pizzaId: string },
    team: TeamType
  ) {
    const { pizzaId, ...combatantState } = state;
    this.combatants[id] = new Combatant(
      {
        ...Pizzas[pizzaId],
        team,
        isPlayerControlled: team === "player" ? true : undefined,
        state: {
          hp: 50,
          xp: 0,
          maxXp: 100,
          maxHp: combatantState.maxHp ?? combatantState.hp ?? 50,
          level: 1,
          ...combatantState,
        },
      },
      this
    );

    this.activeCombatants[team] = this.activeCombatants[team] ?? id;
  }

  createElement() {
    this.element = (
      <div className="Battle">
        <div className="Battle_hero">
          <img src="/images/characters/people/hero.png" alt="Hero" />
        </div>
        <div className="Battle_enemy">
          <img
            src={`/images/characters/people/${this.enemy.spriteName}.png`}
            alt={this.enemy.name}
          />
        </div>
      </div>
    );
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);

      this.playerTeam = new Team("player", "Hero");

      this.enemyTeam = new Team("enemy", "Bully");

      for (const [key, combatant] of Object.entries(this.combatants)) {
        combatant.id = key;

        combatant.init(this.element);

        if (combatant.team === "player") {
          this.playerTeam.combatants.push(combatant);
        } else if (combatant.team === "enemy") {
          this.enemyTeam.combatants.push(combatant);
        }
      }

      this.playerTeam.init(this.element);
      this.enemyTeam.init(this.element);

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
        onWinner: (winner) => {
          if (winner === "player") {
            Object.keys(playerState.pizzas).forEach((id) => {
              const playerStatePizza = playerState.pizzas[id];
              const combatant = this.combatants[id];
              if (combatant) {
                playerStatePizza.hp = combatant.state.hp;
                playerStatePizza.maxHp = combatant.state.maxHp;
                playerStatePizza.xp = combatant.state.xp;
                playerStatePizza.maxXp = combatant.state.maxXp;
                playerStatePizza.level = combatant.state.level;
              }
              playerState.pizzas[id] = playerStatePizza;

              playerState.items = this.items
                .filter((item) => {
                  return this.usedInstanceIds[item.instanceId];
                })
                .map(({ team: _team, ...item }) => item);
            });
          }

          this.element?.remove();
          this.onComplete(winner);
        },
      });

      this.turnCycle.init();
    }
  }
}
