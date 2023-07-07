import {
  BattleBehaviorType,
  BattleBehaviors,
} from "@/Behaviors/BattleBehaviors";
import { Battle, Team } from "./Battle";
import { Submission } from "@/Ui/SubmissionMenu";

type TurnCycleConfig<R = void> = {
  battle: Battle;
  onNewEvent: (event: BattleBehaviorType) => Promise<R>;
};

export class TurnCycle {
  battle: Battle;
  onNewEvent: <R = void>(event: BattleBehaviorType) => Promise<R>;
  currentTeam: Team = "player";

  constructor({ battle, onNewEvent }: TurnCycleConfig) {
    this.battle = battle;
    this.onNewEvent = onNewEvent as typeof this.onNewEvent;
  }

  async turn() {
    // Get the caster

    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId =
      this.battle.activeCombatants[
        caster.team === "player" ? "enemy" : "player"
      ];
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent<Submission>(
      BattleBehaviors.submissionMenu({
        caster,
        enemy,
      })
    );

    const resultingEvents = submission.action.success;

    for (const rawEvent of resultingEvents) {
      const event = {
        ...rawEvent,
        details: {
          ...rawEvent.details,
          submission,
          action: submission.action,
          caster,
          target: submission.target,
        },
      };
      await this.onNewEvent(event as BattleBehaviorType);
    }

    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
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
