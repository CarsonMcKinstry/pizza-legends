import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseUiState } from "../../store";
import { CombatantState } from "../Combatant/types";
import { Team } from "../../../types";

export type BattleAnimation = {
  animation: string;
  team: Team;
  onComplete: () => void;
};

export type BattleState = BaseUiState & {
  combatants?: Record<string, CombatantState>;
  activeCombatants: {
    player: string;
    enemy: string;
  };
  damaged?: string;
  animation?: BattleAnimation;
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
    damage(
      state,
      { payload }: PayloadAction<{ targetId: string; damage: number }>
    ) {
      const { targetId, damage } = payload;
      const target = state.combatants?.[targetId];

      if (target) {
        state.combatants![targetId] = {
          ...target,
          hp: target.hp - (damage ?? 0),
        };
        state.damaged = targetId;
      }
    },
    stopBlinking(state) {
      delete state.damaged;
    },
    startAnimation(
      state,
      {
        payload,
      }: PayloadAction<{
        animation: string;
        team: Team;
        onComplete: () => void;
      }>
    ) {
      state.animation = payload;
    },
    animationEnded(state) {
      delete state.animation;
    },
  },
});

export const BattleActions = BattleSlice.actions;
