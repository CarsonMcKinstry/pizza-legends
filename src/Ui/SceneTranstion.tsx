import "@/styles/SceneTransition.css";
import { UiElement, UiElementConfig } from "./UiElement";
import {
  SceneTransitionAnimator,
  SceneTransitionState,
} from "@/components/SceneTransition";

export class SceneTransition extends UiElement<SceneTransitionState> {
  constructor(config: UiElementConfig) {
    super({
      name: "SceneTransition",
      ...config,
      storeConfig: () => {
        return {
          isDone: false,
        };
      },
    });
  }

  override render(): JSX.Element {
    return (
      <SceneTransitionAnimator
        store={this.store!}
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
    this.setState({
      isDone: true,
    });
  }
}
