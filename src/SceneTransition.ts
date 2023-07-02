import "./SceneTransition.css";

export class SceneTransition {
  element: HTMLDivElement | null = null;

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("SceneTransition");
  }

  fadeOut() {
    this.element?.classList.add("fade-out");
    this.element?.addEventListener(
      "animationend",
      () => {
        this.element?.remove();
      },
      { once: true }
    );
  }

  init(container: HTMLElement, onComplete: () => void) {
    this.createElement();
    container.appendChild(this.element!);

    this.element?.addEventListener(
      "animationend",
      () => {
        onComplete();
      },
      { once: true }
    );
  }
}
