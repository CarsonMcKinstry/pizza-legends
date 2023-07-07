import { TextMessage } from "@/Ui/TextMessage";
import { createBehaviorHandler, DetailedAction } from "./createBehaviorHandler";
import { BattleEvent } from "@/Battle/BattleEvent";
import { Action } from "@/Content/Actions";
import { Combatant } from "@/Battle/Combatant";

export const battleBehaviorHandler = createBehaviorHandler({
  exampleState: {} as BattleEvent,
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
      }>
    ) {},
    animation(_state, _action: DetailedAction<{ name: string }>) {},
    damage(_state, _action: DetailedAction<{ damage: number }>) {},
  },
});

export type BattleBehaviorType = ReturnType<
  (typeof battleBehaviorHandler.actions)[keyof typeof battleBehaviorHandler.actions]
>;

export const BattleBehaviors = battleBehaviorHandler.actions;
