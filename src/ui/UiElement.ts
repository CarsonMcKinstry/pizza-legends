import { ReactNode } from "react";
import { Root, createRoot } from "react-dom/client";
import { StoreApi } from "zustand";

export abstract class UiElement<T = never> {
  root: Root | null = null;
  element: HTMLElement | null = null;

  state: StoreApi<T> | null = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add(this.name);

    this.root = createRoot(this.element);

    this.root.render(this.render());

    this.bindActionListeners();
  }

  abstract render(): ReactNode;

  abstract bindActionListeners(): void;

  unmount() {
    this.root?.unmount();
    this.element?.remove();
  }

  init(container: HTMLElement = document.querySelector(".game-overlay")!) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}
