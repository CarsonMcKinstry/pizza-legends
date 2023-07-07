import { BattleBehaviorType } from "@/Behaviors/BattleBehaviors";
import { Status, TargetType } from "@/types";

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
  saucyStatus: {
    name: "Tomato Squeeze",
    success: [
      {
        type: "textMessage",
        details: {
          text: "{CASTER} uses {ACTION}",
        },
      },
      {
        type: "stateChange",
        details: {
          targetType: TargetType.Friendly,
          onCaster: true,
          status: {
            type: Status.Saucy,
            expiresIn: 3,
          },
        },
      },
    ],
  },
  clumsyStatus: {
    name: "Olive Oil",
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
          animation: "glob",
          color: "#dafd2a",
        },
      },
      {
        type: "stateChange",
        details: {
          status: {
            type: Status.Clumsy,
            expiresIn: 3,
          },
        },
      },
      {
        type: "textMessage",
        details: {
          text: "{TARGET} is slipping all around!",
        },
      },
    ],
  },
};
