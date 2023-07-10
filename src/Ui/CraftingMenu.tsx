import { Pizzas } from "@/Content/Pizzas";
import { KeyboardMenu } from "@/Inputs/KeyboardMenu";
import { playerState } from "@/State/PlayerState";
import React, { JSX } from "jsx-dom";

type CraftingMenuConfig = {
  pizzas: string[];
  onComplete: () => void;
};

export class CraftingMenu {
  element?: JSX.Element;
  pizzas: string[];
  onComplete: () => void;
  keyboardMenu?: KeyboardMenu;

  constructor(config: CraftingMenuConfig) {
    this.onComplete = config.onComplete;
    this.pizzas = config.pizzas;
  }

  getOptions() {
    return this.pizzas.map((id) => {
      const base = Pizzas[id];
      return {
        label: base.name,
        description: base.name,
        handler: () => {
          playerState.addPizza(id);

          this.close();
        },
      };
    });
  }

  createElement() {
    this.element = (
      <div className="overlayMenu">
        <h2>Crafting Menu</h2>
      </div>
    );
  }

  close() {
    this.keyboardMenu?.close();
    this.element?.remove();
    this.onComplete();
  }

  init(container: JSX.Element) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    if (this.element) {
      container.appendChild(this.element);
      this.keyboardMenu?.init(this.element);
      this.keyboardMenu?.setOptions(this.getOptions());
    }
  }
}
