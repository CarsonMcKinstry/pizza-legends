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

  async turn() {
    // Get the caster

    const casterId = this.battle.activeCombatants[this.currentTeam];

    const caster = this.battle.combatants[casterId];

    const submission = await this.onNewEvent(
      BattleBehaviors.submissionMenu({
        caster,
      })
    );

    // const casterId = this.battle.activeCombatants[this.currentTeam];
    // const caster = this.battle.combatants[casterId];
    // const enemyId =
    //   this.battle.activeCombatants[
    //     caster.team === "player" ? "enemy" : "player"
    //   ];
    // const enemy = this.battle.combatants[enemyId];
    // const submission = await this.onNewEvent({
    //   type: "submissionMenu",
    //   enemy,
    //   caster,
    // });
  }

  async init() {
    await this.onNewEvent(
      BattleBehaviors.textMessage({
        text: "The battle is starting!",
      })
    );

    this.turn();
  }
}
