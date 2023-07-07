import { BattleBehaviorType } from "@/Behaviors/BattleBehaviors";

export type Action = {
  name: string;
  success: BattleBehaviorType[];
};

export const Actions: Record<string, Action> = {
  damage1: {
    name: "Whomp!",
    success: [
      {
        type: "textMessage",
        details: {
          text: "{CASTER} uses {ACTION}",
        },
      },
      {
        type: "animation",
        details: {
          animation: "spin",
        },
      },
      {
        type: "stateChange",
        details: {
          damage: 10,
        },
      },
    ],
  },
};
