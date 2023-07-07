import "@/styles/Battle.css";
import { UiElement, UiElementConfig } from "@/Ui/UiElement";
import { Combatant } from "./Combatant";
import { Pizzas } from "@/Content/Pizzas";
import React from "react";

import { TurnCycle } from "./TurnCycle";
import { BattleEvent } from "./BattleEvent";
import { BattleUi, BattleUiState } from "@/components/BattleUi/BattleUi";
import { StoreApi, createStore } from "zustand";

export type Team = "player" | "enemy";

type BattleConfig = Omit<UiElementConfig, "name"> & {};

export type BattleState = {
  activeCombatants: {
    player?: string;
    enemy?: string;
  };
};

export class Battle extends UiElement<BattleState> {
  combatants: Record<string, Combatant>;
  turnCycle?: TurnCycle;

  battleUiStore: StoreApi<BattleUiState>;

  constructor(config: BattleConfig) {
    super({
      name: "Battle",
      onComplete: config.onComplete,
      storeConfig: () => ({
        activeCombatants: {
          player: "player1",
          enemy: "enemy1",
        },
      }),
    });

    this.combatants = {
      player1: new Combatant(
        {
          ...Pizzas["s001"],
          id: "player1",
          team: "player",
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
      enemy1: new Combatant(
        {
          ...Pizzas["v001"],
          id: "enemy1",
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
      enemy2: new Combatant(
        {
          ...Pizzas["f001"],
          id: "enemy2",
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

    this.battleUiStore = createStore<BattleUiState>(() => ({}));
  }

  render() {
    return (
      <>
        <div className="Battle_hero">
          <img src="/images/characters/people/hero.png" alt="Hero" />
        </div>
        <div className="Battle_enemy">
          <img src="/images/characters/people/npc3.png" alt="Enemy" />
        </div>

        {Object.entries(this.combatants).map(([key, combatant]) => {
          return (
            <React.Fragment key={key}>{combatant.render()}</React.Fragment>
          );
        })}

        <BattleUi store={this.battleUiStore} />
      </>
    );
  }

  override afterRender(): void {
    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
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
