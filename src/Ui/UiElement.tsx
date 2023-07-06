// import { ConfigureStoreOptions, Store, configureStore } from "@reduxjs/toolkit";
import { createContext } from "react";
import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { StateCreator, StoreApi, createStore } from "zustand";

type OnComplete<R = void> = (value?: R) => void;

export type UiElementConfig<S = any, R = void> = {
  onComplete: OnComplete<R>;
  storeConfig?: StateCreator<S>;
  // storeConfig?: ConfigureStoreOptions<S>;
};

export interface UiElement<S = any, R = void> {
  afterRender?(): void;
}

export abstract class UiElement<S = any, R = void> {
  name: string;
  element?: HTMLElement;
  root?: Root;
  onComplete: OnComplete<R>;

  store?: StoreApi<S>;

  constructor(config: UiElementConfig<S, R> & { name: string }) {
    this.name = config.name;
    this.onComplete = config.onComplete;

    if (config.storeConfig) {
      this.store = createStore(config.storeConfig);
    }
  }
  setState(...args: Parameters<StoreApi<S>["setState"]>) {
    this.store?.setState(...args);
  }

  get state() {
    return this.store?.getState() as S;
  }

  abstract render(): JSX.Element;

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add(this.name);

    this.root = createRoot(this.element);

    this.root.render(this.render());

    this.afterRender?.();
  }

  unmount() {
    this.root?.unmount();
    this.element?.remove();
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.append(this.element);
    }
  }
}
