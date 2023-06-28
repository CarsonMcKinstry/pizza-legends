import "./styles/TitleScreen.css";
import TitleScreenLogo from "./images/logo.png";
import { KeyboardMenu } from "./KeyboardMenu";

export class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  getOptions(resolve) {
    const options = [
      {
        label: "New Game",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        },
      },
      // Maybe have a continue option
    ];

    if (!!this.progress.getSaveFile()) {
      options.push({
        label: "Continue Game",
        description: "Resume your adventure",
        handler: () => {
          this.close();
          resolve(this.progress.load());
        },
      });
    }

    return options;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = `
        <img class="TitleScreen_logo" src="${TitleScreenLogo}" alt="Pizza Legends" />
    `;
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  async init(container) {
    return new Promise((resolve) => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
