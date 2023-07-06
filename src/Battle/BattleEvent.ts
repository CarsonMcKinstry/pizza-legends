import {
  BattleBehaviorType,
  battleBehaviorHandler,
} from "@/Behaviors/BattleBehaviors";
import { Battle } from "./Battle";

type EventResolver = (value: void | PromiseLike<void>) => void;

type BattleEventConfig = {
  battle: Battle;
  event: BattleBehaviorType;
};

export class BattleEvent {
  battle: Battle;
  event: BattleBehaviorType;
  resolve?: EventResolver;

  constructor({ battle, event }: BattleEventConfig) {
    this.event = event;
    this.battle = battle;
  }

  init(resolve: EventResolver) {
    this.resolve = resolve;
    battleBehaviorHandler.run(this, this.event);
  }
}
