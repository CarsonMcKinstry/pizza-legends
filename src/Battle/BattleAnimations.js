import { wait } from "../utils";

export const BattleAnimations = {
  async spin(event, onComplete) {
    const element = event.caster.pizzaElement;
    const animationClassName =
      event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";

    element.classList.add(animationClassName);
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClassName);
      },
      { once: true }
    );

    await wait(100);
    onComplete();
  },

  async glob(event, onComplete) {
    const { caster } = event;
    let element = document.createElement("div");
    element.classList.add("glob-orb");
    element.classList.add(
      caster.team === "player" ? "battle-glob-right" : "battle-glob-left"
    );

    element.innerHTML = `
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>
    `;

    element.addEventListener("animationend", () => {
      element.remove();
    });

    document.querySelector(".Battle").appendChild(element);

    await wait(820);
    onComplete();
  }
};
