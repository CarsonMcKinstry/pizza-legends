import { BattleBehavior, battleBehavior } from "../Battle/BattleBehaviors";

export type Ability = {
  name: string;
  success: BattleBehavior[];
};

export const Abilities = {
  damage1: {
    name: "Whomp",
    success: [
      battleBehavior.textMessage({ text: "{CASTER} uses {ABILITY}!" }),
      battleBehavior.animation({
        animation: "spin",
      }),
      battleBehavior.stateChange({ damage: 10 }),
    ],
  } as Ability,
} as const;
