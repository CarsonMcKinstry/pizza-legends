import { Combatant } from "@/Battle/Combatant";
import { DetailedAction } from "@/Behaviors/createBehaviorHandler";

import { wait } from "@/utils";

export const BattleAnimations: Record<
  string,
  (
    event: DetailedAction<{ caster?: Combatant }>,
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
};
