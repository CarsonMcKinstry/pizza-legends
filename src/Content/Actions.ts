import { BattleBehaviorType } from "@/Behaviors/BattleBehaviors";
import { Status, TargetType } from "@/types";

export type Action = {
  name: string;
  description: string;
  success: BattleBehaviorType[];
  targetType?: TargetType;
};

const createEvent = (
  type: BattleBehaviorType["type"],
  details: BattleBehaviorType["details"]
): BattleBehaviorType => {
  return {
    type,
    details,
  } as BattleBehaviorType;
};

const castTextEvent = createEvent("textMessage", {
  text: "{CASTER} uses {ACTION}!",
});

export const Actions: Record<string, Action> = {
  damage1: {
    name: "Whomp!",
    description: "",
    success: [
      castTextEvent,
      createEvent("animation", {
        animation: "spin",
      }),

      createEvent("stateChange", {
        damage: 10,
      }),
    ],
  },
  saucyStatus: {
    name: "Tomato Squeeze",
    description: "",
    targetType: TargetType.Friendly,
    success: [
      castTextEvent,
      createEvent("stateChange", {
        targetType: TargetType.Friendly,
        onCaster: true,
        status: {
          type: Status.Saucy,
          expiresIn: 3,
        },
      }),
    ],
  },
  clumsyStatus: {
    name: "Olive Oil",
    description: "",
    success: [
      castTextEvent,
      createEvent("animation", {
        animation: "glob",
        color: "#dafd2a",
      }),
      createEvent("stateChange", {
        status: {
          type: Status.Clumsy,
          expiresIn: 3,
        },
      }),
      createEvent("textMessage", {
        text: "{TARGET} is slipping all around!",
      }),
    ],
  },
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: TargetType.Friendly,
    success: [
      castTextEvent,
      createEvent("stateChange", {
        status: null,
      }),
      createEvent("textMessage", {
        text: "Feeling fresh!",
      }),
    ],
  },
  item_recoverHp: {
    name: "Parmesan",
    targetType: TargetType.Friendly,
    description: "",
    success: [
      createEvent("textMessage", {
        text: "{CASTER} sprikles on some {ACTION}!",
      }),
      createEvent("stateChange", {
        recover: 10,
      }),
      createEvent("textMessage", {
        text: "{CASTER} recovers HP!",
      }),
    ],
  },
};
