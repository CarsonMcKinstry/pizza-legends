import { clamp, createReduxContext } from "@/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

enum Status {
  Saucy = "saucy",
  Clumsy = "clumsy",
}

export type CombatantStatus = {
  type: Status;
  expiresIn: number;
};

export type CombatantState = {
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  level: number;
  status?: CombatantStatus;
};

// export const CombatantSlice = createSlice({
//   name: "Combatant",
//   initialState: {} as CombatantState,
//   reducers: {
//     update(state, action: PayloadAction<Partial<CombatantState>>) {
//       return {
//         ...state,
//         ...action.payload,
//       };
//     },
//   },
// });

// export const [CombatantContext, useCombatantSelector] =
//   createReduxContext<CombatantState>();

// export const useCombatantState = () => {
//   return useCombatantSelector(({ level, status, hp, maxHp, xp, maxXp }) => {
//     return {
//       level,
//       status,
//       hpPercentage: clamp(Math.floor((hp / maxHp) * 100), 0, 100),
//       xpPercentage: Math.floor((xp / maxXp) * 100),
//     };
//   });
// };
