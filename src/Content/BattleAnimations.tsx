import React from "jsx-dom";
import { Combatant } from "@/Battle/Combatant";
import { DetailedAction } from "@/Behaviors/createBehaviorHandler";

import { wait } from "@/utils";

export const BattleAnimations: Record<
  string,
  (
    event: DetailedAction<{ caster?: Combatant; color?: string }>,
    onComplete: () => void
  ) => void
> = {
  async spin(event, onComplete) {
    const element = event.details.caster?.pizzaElement;

    const animationClassName =
      event.details.caster?.team === "player"
        ? "battle-spin-right"
        : "battle-spin-left";

    element?.classList.add(animationClassName);

    element?.addEventListener(
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
    const { caster, color } = event.details;

    const glob = (
      <div
        className={[
          "glob-orb",
          caster?.team === "player" ? "battle-glob-right" : "battle-glob-left",
        ]}
        onAnimationEnd={() => {
          glob.remove();
        }}
      >
        <svg viewBox="0 0 32 32" width="32" height="32">
          <circle cx="16" cy="16" r="16" fill={color} />
        </svg>
      </div>
    );

    caster?.battle.container.appendChild(glob);

    await wait(820);
    onComplete();
  },
};
