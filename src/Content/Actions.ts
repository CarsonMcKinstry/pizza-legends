import {
  BattleBehaviorType,
  BattleBehaviors,
} from "@/Behaviors/BattleBehaviors";

type Action = {
  name: string;
  success: BattleBehaviorType[];
};

export const Actions: Record<string, Action> = {
  damage1: {
    name: "Whomp!",
    success: [
      BattleBehaviors.textMessage({
        text: "{CASTER} uses Whomp!",
      }),
      //   BattleBehaviors.animation({
      //     name: "willBeDefinedHere",
      //   }),
      //   BattleBehaviors.damage({
      //     damage: 10,
      //   }),
    ],
  },
};
