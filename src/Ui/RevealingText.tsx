import React, { JSX } from "jsx-dom";

type CharacterConfig = {
  element: JSX.Element;
  delayAfter: number;
};

type RevealingTextConfig = {
  element: JSX.Element;
  text: string;
  speed?: number;
};

export class RevealingText {
  element: JSX.Element;
  text: string;
  speed = 60;

  timeout?: number;
  isDone = false;

  constructor(config: RevealingTextConfig) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed ?? this.speed;
  }

  init() {
    const characters = Array.from(this.text).map((char) => {
      const element = <span>{char}</span>;

      this.element.appendChild(element);

      return {
        element,
        delayAfter: char === " " ? 0 : this.speed,
      };
    });

    this.revealOneCharacter(characters);
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element
      .querySelectorAll("span")
      .forEach((s) => s.classList.add("revealed"));
  }

  revealOneCharacter([next, ...rest]: CharacterConfig[]) {
    next.element.classList.add("revealed");
    if (rest.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(rest);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }
}
