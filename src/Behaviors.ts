import { TextMessageConfig } from "./UI/TextMesage";
import { Direction } from "./types";
import { BuildBehaviorType, createBehaviors } from "./utils/createBehaviors";

export const behavior = createBehaviors<{
  walk: {
    direction: Direction;
    who?: string;
    retry?: true;
    tiles?: number;
  };
  stand: {
    direction: Direction;
    time?: number;
    who?: string;
  };
  textMessage: Pick<TextMessageConfig, "text"> & {
    who?: string;
    faceHero?: boolean;
  };
  changeScene: {
    scene: string;
  };
}>("walk", "stand", "textMessage", "changeScene");

export type Behavior = BuildBehaviorType<typeof behavior>;

export type BehaviorType = Behavior["type"];

export type BehaviorMap<State> = Partial<{
  [Key in BehaviorType]: (
    state: State,
    behavior: Extract<Behavior, { type: Key }>
  ) => void;
}>;

export type AsBehavior<T extends BehaviorType> = Extract<Behavior, { type: T }>;

export const isBehavior = <T extends BehaviorType>(
  behavior: Behavior,
  type: T
): behavior is AsBehavior<T> => {
  return behavior.type === type;
};
