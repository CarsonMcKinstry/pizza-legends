import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseUiState } from "../../store";
import { CombatantState } from "../Combatant/types";
import { CombatantStatus, Team } from "../../../types";
import { clamp } from "../../../utils/clamp";

export type BattleAnimation = {
  animation: string;
  team: Team;
  color?: string;
  onComplete: () => void;
};

export type BattleState = BaseUiState & {
  combatants: Record<string, CombatantState>;
  activeCombatants: {
    player: string;
    enemy: string;
  };
  damaged?: string;
  animation?: BattleAnimation;
};

const initialState: BattleState = {
  isOpen: false,
  combatants: {},
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
      const target = state.combatants[targetId];

      if (target) {
        state.combatants![targetId] = {
          ...target,
          hp: target.hp - (damage ?? 0),
        };
        state.damaged = targetId;
      }
    },
    statusChange(
      state,
      {
        payload,
      }: PayloadAction<{
        targetId: string;
        casterId: string;
        status: CombatantStatus;
      }>
    ) {
      const { targetId, status } = payload;
      const target = state.combatants[targetId];

      if (target) {
        state.combatants[targetId] = {
          ...target,
          status,
        };
      }
    },
    statusExpired(state, { payload }: PayloadAction<string>) {
      const target = state.combatants[payload];

      if (target) {
        delete state.combatants[payload].status;
      }
    },
    recover(
      state,
      {
        payload,
      }: PayloadAction<{
        targetId: string;
        amount: number;
      }>
    ) {
      const { targetId, amount } = payload;
      const target = state.combatants[targetId];

      if (target) {
        state.combatants[targetId] = {
          ...target,
          hp: clamp(target.hp + amount, 0, target.maxHp),
        };
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
        color?: string;
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
