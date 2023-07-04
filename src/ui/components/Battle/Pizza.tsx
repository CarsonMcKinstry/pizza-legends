import clsx from "clsx";
import { Team } from "../../../types";
import { BattleAnimation } from "./state";
import { Animations } from "./Animations";
import { Glob } from "./Glob";

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
  const onPizza = animation?.animation === "spin";

  const animationName = animation
    ? Animations[animation.animation][animation.team]
    : undefined;

  return (
    <>
      <img
        className={clsx("Pizza", team, {
          active,
          "battle-damage-blink": damaged,
          [animationName!]: onPizza,
        })}
        src={src}
        alt={name}
        onAnimationEnd={() => {
          if (onPizza) {
            animation?.onComplete();
          }
        }}
      />
      {!onPizza && <Glob {...animation!} />}
    </>
  );
};
