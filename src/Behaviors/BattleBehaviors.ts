import { TextMessage } from "@/Ui/TextMessage";
import { createBehaviorHandler, DetailedAction } from "./createBehaviorHandler";
import { BattleEvent } from "@/Battle/BattleEvent";
import { Action } from "@/Content/Actions";
import { Combatant } from "@/Battle/Combatant";
import { Submission, SubmissionMenu } from "@/Ui/SubmissionMenu";
import { clamp, wait } from "@/utils";
import { BattleAnimations } from "@/Content/BattleAnimations";
import { CombatantStatus, TargetType, TeamType } from "@/types";
import { ReplacementMenu } from "@/Ui/ReplacementMenu";

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
      const replacements = Object.values(battleEvent.battle.combatants).filter(
        (combatant) =>
          combatant.id !== caster.id &&
          combatant.team === caster.team &&
          combatant.state.hp > 0
      );
      const menu = new SubmissionMenu({
        caster,
        enemy,
        replacements,
        items: battleEvent.battle.items,
        onComplete: (submission: Submission) => {
          battleEvent.resolve?.(submission as any);
        },
      });

      if (battleEvent.battle.element) {
        menu.init(battleEvent.battle.element);
      }
    },
    animation(
      battleEvent,
      action: DetailedAction<{
        animation: string;
        caster?: Combatant;
        color?: string;
      }>
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
        recover?: number;
        onCaster?: boolean;
        status?: CombatantStatus | null;
        targetType?: TargetType;
      }>
    ) {
      const { target, caster, damage, recover, onCaster, status } =
        action.details;
      const who = onCaster ? caster : target;

      if (who) {
        if (damage) {
          // modify the target to have less hp

          target?.update({
            hp: clamp(target.state.hp - damage, 0, who.state.maxHp),
          });

          // start blinking
          target?.pizzaElement?.classList.add("battle-damage-blink");
        }

        if (recover) {
          const newHp = clamp(who?.state.hp + recover, 0, who.state.maxHp);

          who.update({
            hp: newHp,
          });
        }

        if (status) {
          if (who) {
            who.update({
              status: {
                ...status,
              },
            });
          }
        } else if (status === null) {
          if (who) {
            who.update({
              status: undefined,
            });
          }
        }
      }

      // Wait a bit...
      await wait(600);

      battleEvent.battle.playerTeam?.update();
      battleEvent.battle.enemyTeam?.update();

      // stop bliking

      target?.pizzaElement?.classList.remove("battle-damage-blink");

      battleEvent.resolve?.();
    },
    async replace(
      battleEvent,
      action: DetailedAction<{
        replacement: Combatant;
      }>
    ) {
      const { replacement } = action.details;

      const prevCombatant =
        battleEvent.battle.combatants[
          battleEvent.battle.activeCombatants[replacement.team]
        ];

      delete battleEvent.battle.activeCombatants[replacement.team];

      prevCombatant.update({});

      await wait(400);

      battleEvent.battle.activeCombatants[replacement.team] = replacement.id!;

      replacement.update({});

      await wait(400);

      battleEvent.battle.playerTeam?.update();
      battleEvent.battle.enemyTeam?.update();

      battleEvent.resolve?.();
    },
    replacementMenu(battleEvent, action: DetailedAction<{ team: TeamType }>) {
      const menu = new ReplacementMenu({
        replacements: Object.values(battleEvent.battle.combatants).filter(
          (c) => {
            return c.team === action.details.team && c.state.hp > 0;
          }
        ),
        onComplete: (replacement) => {
          battleEvent.resolve?.(replacement as any);
        },
      });
      menu.init(battleEvent.battle.element!);
    },
  },
});

export type BattleBehaviorType = ReturnType<
  (typeof battleBehaviorHandler.actions)[keyof typeof battleBehaviorHandler.actions]
>;

export const BattleBehaviors = battleBehaviorHandler.actions;
