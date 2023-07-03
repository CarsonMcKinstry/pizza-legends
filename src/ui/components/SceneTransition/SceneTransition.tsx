import "./SceneTransition.css";

import { useSelector } from "react-redux";
import { SceneTransitionState } from "./state";
import { UserInterfaceState } from "../../store";
import clsx from "clsx";

export const SceneTransition = () => {
  const { isOpen, onComplete, fadeInFinished } = useSelector<
    UserInterfaceState,
    SceneTransitionState
  >((state) => state.sceneTransition);
  console.log({ isOpen, onComplete, fadeInFinished });
  if (!isOpen) return null;

  return (
    <div
      className={clsx("SceneTransition", {
        "fade-out": fadeInFinished,
      })}
      onAnimationEnd={() => {
        if (!fadeInFinished) {
          onComplete?.();
        }
      }}
    />
  );
};
