import { BattleBehavior, battleBehavior } from "../Battle/BattleBehaviors";

type TargetType = "friendly" | "enemy";

export type Ability = {
  name: string;
  targetType?: TargetType;
  success: BattleBehavior[];
};

const abilityUsed = battleBehavior.textMessage({
  text: "{CASTER} uses {ABILITY}!",
});

export const Abilities = {
  damage1: {
    name: "Whomp",
    success: [
      abilityUsed,
      battleBehavior.animation({
        animation: "spin",
      }),
      battleBehavior.stateChange({ damage: 10 }),
    ],
  } as Ability,
  saucyStatus: {
    name: "Tomato Squeeze",
    targetType: "friendly",
    success: [
      abilityUsed,
      battleBehavior.stateChange({
        status: {
          type: "saucy",
          expiresIn: 3,
        },
      }),
    ],
  } as Ability,
  clumsyStatus: {
    name: "Olive Oil",
    success: [
      abilityUsed,
      battleBehavior.animation({
        animation: "glob",
        color: "#dafd2a",
      }),
      battleBehavior.stateChange({
        status: {
          type: "clumsy",
          expiresIn: 3,
        },
      }),
      battleBehavior.textMessage({
        text: "{TARGET} is slipping all around!",
      }),
    ],
  } as Ability,
} as const;
