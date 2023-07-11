import { KeyboardMenu, MenuOption } from "@/Inputs/KeyboardMenu";
import { Progress } from "@/Progress";
import "@/styles/TitleScreen.css";
import React, { JSX } from "jsx-dom";

type TitleScreenConfig = {
  onComplete: () => void;
  progress: Progress;
};

export class TitleScreen {
  element?: JSX.Element;
  keyboardMenu?: KeyboardMenu;
  onComplete: () => void;
  progress: Progress;

  constructor(config: TitleScreenConfig) {
    this.onComplete = config.onComplete;
    this.progress = config.progress;
  }

  getOptions(resolve: (value?: any) => void): MenuOption[] {
    const saveFile = this.progress.getSaveFile();
    return [
      {
        label: "New Game",
        description: "Start a new pizza andventure!",
        handler: () => {
          this.close();
          resolve();
        },
      },
      saveFile
        ? {
            label: "Continue game",
            description: "Resume your adventure",
            handler: () => {
              this.close();
              resolve(saveFile);
            },
          }
        : null,
    ].filter((item: any): item is MenuOption => !!item);
  }

  close() {
    this.keyboardMenu?.close();
    this.element?.remove();
  }

  createElement() {
    this.element = (
      <div className="TitleScreen">
        <img
          class="TitleScreen_logo"
          src="/images/logo.png"
          alt="Pizza Legends"
        />
      </div>
    );
  }

  init(container: JSX.Element) {
    return new Promise<any | undefined>((resolve) => {
      this.createElement();
      if (this.element) {
        container.appendChild(this.element);
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions(resolve));
      }
    });
  }
}
