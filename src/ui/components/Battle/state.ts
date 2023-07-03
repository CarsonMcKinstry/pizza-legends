import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseUiState } from "../../store";
import { CombatantState } from "../Combatant/types";
import { Team } from "../../../types";

export type BattleState = BaseUiState & {
  combatants?: Record<string, CombatantState>;
  activeCombatants: {
    player: string;
    enemy: string;
  };
};

const initialState: BattleState = {
  isOpen: false,
  activeCombatants: {
    player: "",
    enemy: "",
  },
};

export const BattleSlice = createSlice({
  name: "Battle",
  initialState,
  reducers: {
    start: (
      state,
      {
        payload,
      }: PayloadAction<Pick<BattleState, "combatants" | "activeCombatants">>
    ) => {
      state.isOpen = true;
      state.activeCombatants = payload.activeCombatants;
      state.combatants = payload.combatants;
    },
    finish: (state) => {
      state.isOpen = false;
    },
    newEnemyAppeard(
      state,
      {
        payload,
      }: PayloadAction<{
        team: Team;
        id: string;
      }>
    ) {
      state.activeCombatants[payload.team] = payload.id;
    },
  },
});

export const BattleActions = BattleSlice.actions;
