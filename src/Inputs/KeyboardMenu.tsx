import "@/styles/KeyboardMenu.css";
import React, { JSX } from "jsx-dom";
import { KeyPressListener } from "./KeyPressListener";
import { focusNextElement, focusPrevElement } from "@/utils";

export type MenuOption = {
  label: string;
  description: string;
  handler: () => void;
  disabled?: true;
  right?: () => string | JSX.Element;
};

export class KeyboardMenu {
  options: MenuOption[] = [];
  element?: JSX.Element;
  descriptionContainer?: JSX.Element;
  descriptionElement?: JSX.Element;
  descriptionElementText?: HTMLParagraphElement;

  prevFocus?: HTMLButtonElement;

  up?: KeyPressListener;
  down?: KeyPressListener;

  constructor(config?: { descriptionContainer?: JSX.Element }) {
    this.descriptionContainer = config?.descriptionContainer;
  }

  setOptions(options: MenuOption[]) {
    this.options = options;

    if (this.element) {
      this.element.innerHTML = "";
      this.element.appendChild(
        <>
          {this.options.map((option, i) => {
            return (
              <div class="option">
                <button
                  data-button={i}
                  onClick={() => {
                    option.handler();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.focus();
                  }}
                  onFocus={(e) => {
                    this.prevFocus = e.currentTarget;
                    if (this.descriptionElementText) {
                      this.descriptionElementText.innerText =
                        option.description;
                    }
                  }}
                  disabled={!!option.disabled}
                >
                  {option.label}
                  {option.right && (
                    <span className="right">
                      {option.right ? option.right() : ""}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </>
      );

      setTimeout(() => {
        focusNextElement(-1, this.element!.querySelectorAll("button"));
      }, 20);
    }
  }

  createElement() {
    this.element = <div className="KeyboardMenu"></div>;

    this.descriptionElement = (
      <div className="DescriptionBox">
        <p>I will be provide you information!</p>
      </div>
    );

    this.descriptionElementText = this.descriptionElement.querySelector(
      "p"
    ) as HTMLParagraphElement;
  }

  close() {
    this.options = [];
    this.element?.remove();
    this.descriptionElement?.remove();
    this.up?.unbind();
    this.down?.unbind();
  }

  init(container: JSX.Element) {
    this.createElement();

    if (this.element && this.descriptionElement) {
      (this.descriptionContainer ?? container).appendChild(
        this.descriptionElement
      );
      container.appendChild(this.element);

      this.up = new KeyPressListener("ArrowUp", () => {
        const current = Number(this.prevFocus?.dataset.button);
        const buttons = this.element!.querySelectorAll(
          "button[data-button]"
        ) as NodeListOf<HTMLButtonElement>;

        focusPrevElement(current, buttons);
      });

      this.down = new KeyPressListener("ArrowDown", () => {
        const current = Number(this.prevFocus?.dataset.button);
        const buttons = this.element!.querySelectorAll(
          "button[data-button]"
        ) as NodeListOf<HTMLButtonElement>;

        focusNextElement(current, buttons);
      });
    }
  }
}
