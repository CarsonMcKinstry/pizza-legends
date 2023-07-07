import { TextMessage } from "@/Ui/TextMessage";
import { createBehaviorHandler, DetailedAction } from "./createBehaviorHandler";
import { BattleEvent } from "@/Battle/BattleEvent";
import { Action } from "@/Content/Actions";
import { Combatant } from "@/Battle/Combatant";
import { Submission, SubmissionMenu } from "@/Ui/SubmissionMenu";
import { wait } from "@/utils";
import { BattleAnimations } from "@/Content/BattleAnimations";

export const battleBehaviorHandler = createBehaviorHandler({
  exampleState: {} as BattleEvent<any>,
  handlers: {
    textMessage(
      battleEvent,
      action: DetailedAction<{
        text: string;
        caster?: Combatant;
        target?: Combatant;
        action?: Action;
      }>
    ) {
      const { caster, target } = action.details;

      const text = action.details.text
        .replace("{CASTER}", caster?.name ?? "")
        .replace("{TARGET}", target?.name ?? "")
        .replace("{ACTION}", action.details.action?.name ?? "");

      const message = new TextMessage({
        text,
        onComplete() {
          battleEvent.resolve?.();
        },
      });

      message.init(battleEvent.battle.container);
    },
    submissionMenu(
      battleEvent,
      action: DetailedAction<{
        caster: Combatant;
        enemy: Combatant;
      }>
    ) {
      const { caster, enemy } = action.details;

      const menu = new SubmissionMenu({
        caster,
        enemy,
        onComplete: (submission: Submission) => {
          battleEvent.resolve?.(submission as any);
        },
      });

      menu.init(battleEvent.battle.container);
    },
    animation(
      battleEvent,
      action: DetailedAction<{ animation: string; caster?: Combatant }>
    ) {
      const fn = BattleAnimations[action.details.animation];
      fn(action, battleEvent.resolve!);
    },
    async stateChange(
      battleEvent,
      action: DetailedAction<{
        damage?: number;
        caster?: Combatant;
        target?: Combatant;
      }>
    ) {
      const { caster, target, damage } = action.details;

      if (damage) {
        // modify the target to have less hp

        target?.update({
          hp: target.state.hp - damage,
        });

        // start blinking
        target?.pizzaElement?.classList.add("battle-damage-blink");
      }

      await wait(600);

      // Wait a bit...
      // stop bliking

      target?.pizzaElement?.classList.remove("battle-damage-blink");

      battleEvent.resolve?.();
    },
  },
});

export type BattleBehaviorType = ReturnType<
  (typeof battleBehaviorHandler.actions)[keyof typeof battleBehaviorHandler.actions]
>;

export const BattleBehaviors = battleBehaviorHandler.actions;
