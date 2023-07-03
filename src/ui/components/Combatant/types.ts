import { Abilities } from "../../../Content/Abilities";
import { Pizza } from "../../../Content/Pizzas";
import { CombatantStatus, Team } from "../../../types";

export type CombatantState = Pizza & {
  id: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  status?: CombatantStatus;
  team: Team;
  abilities: (keyof typeof Abilities)[];
};
