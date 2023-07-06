import clsx from "clsx";
import { useSelector } from "react-redux";
import { SceneTransitionState } from "./state";

type SceneTransitionProps = {
  onComplete: () => void;
  onCleanup: () => void;
};

export const SceneTransitionAnimator = ({
  onCleanup,
  onComplete,
}: SceneTransitionProps) => {
  const isDone = useSelector<SceneTransitionState, boolean>(
    (state) => state.isDone
  );

  return (
    <div
      className={clsx("SceneTransition-animator", {
        "fade-out": isDone,
      })}
      onAnimationEnd={() => {
        if (isDone) {
          onCleanup();
        } else {
          onComplete();
        }
      }}
    />
  );
};
