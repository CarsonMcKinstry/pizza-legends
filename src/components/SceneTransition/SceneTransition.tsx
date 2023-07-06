import clsx from "clsx";
import { StoreApi, useStore } from "zustand";

export type SceneTransitionState = {
  isDone: boolean;
};

type SceneTransitionProps = {
  store: StoreApi<SceneTransitionState>;
  onComplete: () => void;
  onCleanup: () => void;
};

export const SceneTransitionAnimator = ({
  store,
  onCleanup,
  onComplete,
}: SceneTransitionProps) => {
  const { isDone } = useStore(store);

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
