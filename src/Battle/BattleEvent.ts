import { BattleActions } from "../ui/components/Battle/state";
import { Submission, SubmissionMenu } from "../ui/controllers/SubmissionMenu";
import { TextMessage } from "../ui/controllers/TextMessage";
import { wait } from "../utils/wait";
import { Battle } from "./Battle";
import {
  AsBattleBehavior,
  BattleBehavior,
  BattleBehaviorType,
} from "./BattleBehaviors";

type EventResolver<T> = (value?: T | PromiseLike<T>) => void;

type BattleEventHandlers = {
  [Key in BattleBehaviorType]: (res: EventResolver<any>) => void;
};

interface Config {
  battle: Battle;
  event: BattleBehavior;
}

export class BattleEvent implements BattleEventHandlers {
  battle: Battle;
  event: BattleBehavior;

  constructor({ battle, event }: Config) {
    this.battle = battle;
    this.event = event;
  }

  textMessage(resolve: EventResolver<any>) {
    const event = this.event as AsBattleBehavior<"textMessage">;

    const target = this.battle.combatants?.[event.targetId!];
    const caster = this.battle.combatants?.[event.casterId!];

    const text = event.text
      .replace("{CASTER}", caster?.name as string)
      .replace("{TARGET}", target?.name as string)
      .replace("{ABILITY}", event.ability?.name as string);

    const message = new TextMessage(
      {
        ...event,
        text,
        onComplete: () => {
          resolve();
        },
      },
      this.battle.scene
    );

    setTimeout(() => {
      message.init();
    }, 0);
  }

  submissionMenu(resolve: EventResolver<Submission>) {
    const event = this.event as AsBattleBehavior<"submissionMenu">;

    const enemy = this.battle.combatants?.[event.enemy];
    const caster = this.battle.combatants?.[event.caster];

    if (enemy && caster) {
      const menu = new SubmissionMenu({
        enemy,
        caster,
        onComplete: (submission: Submission) => {
          resolve(submission);
        },
      });

      setTimeout(() => {
        menu.init();
      }, 0);
    }
  }

  async stateChange(resolve: EventResolver<any>) {
    const event = this.event as AsBattleBehavior<"stateChange">;

    const { damage, targetId } = event;

    if (damage) {
      this.battle.damage(damage, targetId!);
    }

    await wait(600);

    this.battle.stopBlinking();

    resolve();
  }

  animation(resolve: EventResolver<any>) {
    const event = this.event as AsBattleBehavior<"animation">;

    const caster = this.battle.combatants?.[event.casterId!];

    if (caster) {
      this.battle.startAnimation({
        animation: event.animation,
        team: caster.team === "player" ? "player" : "enemy",
        onComplete: () => {
          resolve();
        },
      });
    }
  }

  init(resolve: EventResolver<any>) {
    return this[this.event.type](resolve);
  }
}
