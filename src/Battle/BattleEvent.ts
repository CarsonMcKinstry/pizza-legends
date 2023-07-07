import {
  BattleBehaviorType,
  battleBehaviorHandler,
} from "@/Behaviors/BattleBehaviors";
import { Battle } from "./Battle";

type EventResolver<R> = (value: void | PromiseLike<void>) => R;

type BattleEventConfig = {
  battle: Battle;
  event: BattleBehaviorType;
};

export class BattleEvent<R> {
  battle: Battle;
  event: BattleBehaviorType;
  resolve?: EventResolver<R>;

  constructor({ battle, event }: BattleEventConfig) {
    this.event = event;
    this.battle = battle;
  }

  init(resolve: EventResolver<R>) {
    this.resolve = resolve;
    battleBehaviorHandler.run(this, this.event);
  }
}
