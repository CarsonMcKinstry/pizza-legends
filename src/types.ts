import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";
import { StoryFlag } from "./Content/StoryFlags";

export type Direction = "up" | "right" | "down" | "left";

export type CutsceneConfig = {
  requires?: StoryFlag[];
  events: SceneBehaviorType[];
};

export type TriggerSpaces = Record<string, CutsceneConfig[]>;

export enum Status {
  Saucy = "saucy",
  Clumsy = "clumsy",
}

export type CombatantStatus = {
  type: Status;
  expiresIn: number;
};

export type TeamType = "player" | "enemy";

export enum TargetType {
  Friendly = "friendly",
}

export type Item = {
  actionId: string;
  instanceId: string;
  team: TeamType;
};

export type CombatantState = {
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  level: number;
  status?: CombatantStatus;
};

export type Enemy = {
  name: string;
  spriteName: string;
  pizzas: Record<
    string,
    Partial<CombatantState> & {
      pizzaId: string;
    }
  >;
};

export enum BattleOutcome {
  Win = "Win",
  Lose = "Lose",
}

export type HeroInitialState = {
  x: number;
  y: number;
  direction: Direction;
};

export enum EntityType {
  Character,
  PizzaStone,
}
