import { StoreApi, useStore } from "zustand";
import clsx from "clsx";

type TransitionProps = {
  state: StoreApi<{ fadeInFinished: boolean }>;
  onComplete: () => void;
};

export const Transition = ({ state, onComplete }: TransitionProps) => {
  const { fadeInFinished } = useStore(state);

  return (
    <div
      className={clsx("container", {
        "fade-out": fadeInFinished,
      })}
      onAnimationEnd={() => {
        if (!fadeInFinished) {
          onComplete();
        }
      }}
    />
  );
};
