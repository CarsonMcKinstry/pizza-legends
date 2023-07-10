import "@/styles/Menus.css";
import { KeyPressListener } from "@/Inputs/KeyPressListener";
import { KeyboardMenu, MenuOption } from "@/Inputs/KeyboardMenu";
import { wait } from "@/utils";
import React, { JSX } from "jsx-dom";
import { playerState } from "@/State/PlayerState";
import { Pizzas } from "@/Content/Pizzas";
import { Progress } from "@/Progress";

type PauseMenuConfig = {
  onComplete: () => void;
  progress: Progress;
};

export class PauseMenu {
  keyboardMenu?: KeyboardMenu;
  element?: JSX.Element;
  onComplete: () => void;
  progress: Progress;

  esc?: KeyPressListener;

  constructor({ onComplete, progress }: PauseMenuConfig) {
    this.onComplete = onComplete;
    this.progress = progress;
  }

  getOptions(pageKey: string): MenuOption[] {
    if (pageKey === "root") {
      const lineupPizzas = playerState.lineup.map((id) => {
        const { pizzaId } = playerState.pizzas[id];

        const base = Pizzas[pizzaId];

        return {
          label: base.name,
          description: `Swap ${base.name} for another pizza`,
          handler: () => {
            this.keyboardMenu?.setOptions(this.getOptions(id));
          },
        };
      });

      return [
        ...lineupPizzas,
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            this.progress.save();
            this.close();
          },
        },
        {
          label: "Close",
          description: "Close the pause menu",
          handler: () => {
            this.close();
          },
        },
      ];
    }

    // Case 2: Show optiosn for just one pizza by id

    const equipped = playerState.pizzas[pageKey];

    const unequipped = Object.keys(playerState.pizzas)
      .filter((id) => {
        return !playerState.lineup.includes(id);
      })
      .map((id) => {
        const { pizzaId } = playerState.pizzas[id];

        const base = Pizzas[pizzaId];

        return {
          label: `Swap for ${base.name}`,
          description: `Swap ${Pizzas[equipped.pizzaId].name}for ${base.name}`,
          handler: () => {
            playerState.swapLineup(pageKey, id);
            this.keyboardMenu?.setOptions(this.getOptions("root"));
          },
        };
      });

    return [
      // Swap for an unequipped pizza
      ...unequipped,
      {
        label: "Move to front",
        description: "Move this pizza to the front of the list",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu?.setOptions(this.getOptions("root"));
        },
      },
      {
        label: "Back",
        description: "Back to the root menu",
        handler: () => {
          this.keyboardMenu?.setOptions(this.getOptions("root"));
        },
      },
    ];
  }

  createElement() {
    this.element = (
      <div className="overlayMenu">
        <h2>Pause Menu</h2>
      </div>
    );
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu?.close();
    this.element?.remove();

    this.onComplete();
  }

  async init(container: JSX.Element) {
    this.createElement();

    if (this.element) {
      this.keyboardMenu = new KeyboardMenu({
        descriptionContainer: container,
      });
      this.keyboardMenu?.init(this.element);
      this.keyboardMenu?.setOptions(this.getOptions("root"));
      container.appendChild(this.element);

      await wait(200);

      this.esc = new KeyPressListener("Escape", () => {
        this.close();
      });
    }
  }
}
