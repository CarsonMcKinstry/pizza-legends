import { Combatant } from "@/Battle/Combatant";
import { Action, Actions } from "@/Content/Actions";
import { KeyboardMenu, MenuOption } from "@/Inputs/KeyboardMenu";
import { Item, TargetType } from "@/types";
import React, { JSX } from "jsx-dom";

export type Submission = {
  action: Action;
  target: Combatant;
  instanceId?: string;
};

type SubmissionMenuConfig = {
  caster: Combatant;
  enemy: Combatant;
  items: Item[];
  onComplete: (submission: Submission) => void;
};

export class SubmissionMenu {
  caster: Combatant;
  enemy: Combatant;
  items: (Item & { quantity: number })[];
  onComplete: (submission: Submission) => void;
  keyboardMenu?: KeyboardMenu;

  constructor({ caster, enemy, onComplete, items }: SubmissionMenuConfig) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;

    const quantityMap: Record<string, Item & { quantity: number }> = {};

    for (const item of items) {
      if (item.team === caster.team) {
        if (!quantityMap[item.actionId]) {
          quantityMap[item.actionId] = {
            quantity: 0,
            ...item,
          };
        }

        quantityMap[item.actionId].quantity += 1;
      }
    }

    this.items = Object.values(quantityMap);
  }

  get pages(): Record<string, MenuOption[]> {
    const backOption = {
      label: "◀",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu?.setOptions(this.pages.root);
      },
    };

    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack",
          handler: () => {
            this.keyboardMenu?.setOptions(this.pages.attacks);
          },
        },
        {
          label: "Items",
          description: "Choose an item",
          handler: () => {
            this.keyboardMenu?.setOptions(this.pages.items);
          },
        },
        {
          label: "Swap",
          description: "Change to another pizza",
          handler: () => {
            this.keyboardMenu?.setOptions(this.pages.items);
          },
        },
      ],
      items: [
        backOption,
        ...this.items.map((item) => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action, item.instanceId);
            },
            right: () => {
              return <span>x{item.quantity}</span>;
            },
          };
        }),
      ],
      swap: [backOption],
      attacks: [
        backOption,
        ...this.caster.actions.map((key) => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action);
            },
          };
        }),
      ],
    };
  }

  showMenu(container: JSX.Element) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.pages.root);
  }

  decide() {
    this.menuSubmit(Actions[this.caster.actions[0]]);
  }

  menuSubmit(action: Action, instanceId?: string) {
    this.keyboardMenu?.close();
    this.onComplete({
      instanceId,
      action,
      target:
        action.targetType === TargetType.Friendly ? this.caster : this.enemy,
    });
  }

  init(container: JSX.Element) {
    if (this.caster.isPlayerControlled) {
      // show the ui
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
