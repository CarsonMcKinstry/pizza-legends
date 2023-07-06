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
