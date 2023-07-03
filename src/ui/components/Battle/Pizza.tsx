import clsx from "clsx";
import { Team } from "../../../types";
import { BattleAnimation } from "./state";
import { Animations } from "./Animations";
import { wait } from "../../../utils/wait";

type PizzaProps = {
  src: string;
  active: boolean;
  damaged: boolean;
  team: Team;
  name: string;
  animation?: BattleAnimation;
};

export const Pizza = ({
  src,
  active,
  team,
  name,
  damaged,
  animation,
}: PizzaProps) => {
  const animationName = animation
    ? Animations[animation.animation][animation.team]
    : "";

  return (
    <img
      className={clsx(
        "Pizza",
        team,
        {
          active,
          "battle-damage-blink": damaged,
        },
        animationName
      )}
      src={src}
      alt={name}
      onAnimationEnd={async () => {
        animation?.onComplete();
      }}
    />
  );
};
