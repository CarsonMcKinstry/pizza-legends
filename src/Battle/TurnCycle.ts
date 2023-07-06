import {
  BattleBehaviorType,
  BattleBehaviors,
} from "@/Behaviors/BattleBehaviors";
import { Battle, Team } from "./Battle";

type TurnCycleConfig = {
  battle: Battle;
  onNewEvent: (event: BattleBehaviorType) => Promise<void>;
};

export class TurnCycle {
  battle: Battle;
  onNewEvent: (event: BattleBehaviorType) => Promise<void>;
  currentTeam: Team = "player";

  constructor({ battle, onNewEvent }: TurnCycleConfig) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
  }

  async turn() {}

  async init() {
    await this.onNewEvent(
      BattleBehaviors.textMessage({
        text: "The battle is starting!",
      })
    );

    this.turn();
  }
}
