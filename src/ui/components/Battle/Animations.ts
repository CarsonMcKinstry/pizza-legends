import { Team } from "../../../types";

export const Animations: Record<string, Record<Team, string>> = {
  spin: {
    player: "battle-spin-right",
    enemy: "battle-spin-left",
  },
};
