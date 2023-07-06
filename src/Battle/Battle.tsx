import "@/styles/Battle.css";
import { UiElement, UiElementConfig } from "@/Ui/UiElement";
import { Combatant } from "./Combatant";
import { Pizzas } from "@/Content/Pizzas";
import React from "react";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createReduxContext } from "@/utils";

export type Team = "player" | "enemy";

type BattleConfig = Omit<UiElementConfig, "name"> & {};

export type BattleState = {
  activeCombatants: {
    player?: string;
    enemy?: string;
  };
};

const battleSlice = createSlice({
  name: "Battle",
  initialState: {
    activeCombatants: {
      player: "player1",
      enemy: "enemy1",
    },
  } as BattleState,
  reducers: {
    newEnemyAppeared(
      state,
      action: PayloadAction<{ team: Team; combatant: string }>
    ) {
      state.activeCombatants[action.payload.team] = action.payload.combatant;
    },
  },
});

export const [BattleContext, useBattleSelector] =
  createReduxContext<BattleState>();

export const useIsActiveCombatant = (id: string, team: Team) =>
  useBattleSelector<BattleState, boolean>(
    (state) => state.activeCombatants[team] === id
  );

export class Battle extends UiElement<BattleState> {
  combatants: Record<string, Combatant>;

  constructor(config: BattleConfig) {
    super({
      name: "Battle",
      onComplete: config.onComplete,
      storeConfig: {
        reducer: battleSlice.reducer,
      },
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
      </>
    );
  }
}
