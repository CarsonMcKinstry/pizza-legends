import "@/styles/SceneTransition.css";

import { UiElement, UiElementConfig } from "./UiElement";
import {
  SceneTransitionAnimator,
  SceneTransitionState,
  sceneTransitionSlice,
} from "@/components/SceneTransition";

export class SceneTransition extends UiElement<SceneTransitionState> {
  constructor(config: UiElementConfig) {
    super({
      name: "SceneTransition",
      ...config,
      storeConfig: {
        reducer: sceneTransitionSlice.reducer,
      },
    });
  }

  override render(): JSX.Element {
    return (
      <SceneTransitionAnimator
        onCleanup={() => {
          this.unmount();
        }}
        onComplete={() => {
          this.onComplete();
        }}
      />
    );
  }

  fadeOut() {
    this.dispatch(sceneTransitionSlice.actions.done());
  }
}
