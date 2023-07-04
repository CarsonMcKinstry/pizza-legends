import clsx from "clsx";
import { BattleAnimation } from "./state";
import { Animations } from "./Animations";

type GlobProps = BattleAnimation;

export const Glob = ({ animation, onComplete, color, team }: GlobProps) => {
  const onGlob = animation === "glob";

  const animationName = animation ? Animations[animation][team] : undefined;
  return (
    <div
      className={clsx("glob-orb", {
        [animationName!]: onGlob,
      })}
      onAnimationEnd={() => {
        if (onGlob) {
          onComplete();
        }
      }}
    >
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill={color ?? "transparent"} />
      </svg>
    </div>
  );
};
