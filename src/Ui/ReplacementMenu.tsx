import { Combatant } from "@/Battle/Combatant";
import { KeyboardMenu } from "@/Inputs/KeyboardMenu";

import { JSX } from "jsx-dom";

type ReplacementMenuConfig = {
  replacements: Combatant[];
  onComplete: (replacement: Combatant) => void;
};

export class ReplacementMenu {
  replacements: Combatant[];
  onComplete: (replacement: Combatant) => void;
  keyboardMenu?: KeyboardMenu;

  constructor({ replacements, onComplete }: ReplacementMenuConfig) {
    this.replacements = replacements;
    this.onComplete = onComplete;
  }

  menuSubmit(replacement: Combatant) {
    this.keyboardMenu?.close();

    this.onComplete(replacement);
  }

  decide() {
    this.menuSubmit(this.replacements[0]);
  }

  showMenu(container: JSX.Element) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(
      this.replacements.map((replacement) => ({
        label: replacement.name,
        description: replacement.name,
        handler: () => {
          this.menuSubmit(replacement);
        },
      }))
    );
  }

  init(container: JSX.Element) {
    if (this.replacements[0].isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
