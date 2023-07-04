import { Team } from "../types";
import { Submission } from "../ui/controllers/SubmissionMenu";
import { Battle } from "./Battle";
import { BattleBehavior, battleBehavior } from "./BattleBehaviors";

export type TurnCycleConfig = {
  battle: Battle;
  onNewEvent: <T = void>(event: BattleBehavior) => Promise<T>;
};

export class TurnCycle {
  battle: Battle;
  onNewEvent: <T = void>(event: BattleBehavior) => Promise<T>;

  currentTeam: Team = "player";

  constructor({ battle, onNewEvent }: TurnCycleConfig) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
  }

  async turn() {
    // Get the caster
    const casterId = this.battle.activeCombatants?.[this.currentTeam];
    const enemyId =
      this.battle.activeCombatants?.[
        this.currentTeam === "player" ? "enemy" : "player"
      ];

    if (casterId && enemyId) {
      const submission = await this.onNewEvent<Submission>(
        battleBehavior.submissionMenu({
          caster: casterId,
          enemy: enemyId,
        })
      );

      const resultingEvents = this.battle.getReplacedEvents(
        casterId,
        submission.ability.success
      );

      for (const event of resultingEvents) {
        await this.onNewEvent({
          ...event,
          ability: submission.ability,
          casterId: casterId,
          targetId: submission.target.id,
        } as BattleBehavior);
      }

      // check for post events
      // do things after the original submission

      const postEvents = this.battle.getPostEvents(casterId);

      for (const event of postEvents) {
        await this.onNewEvent({
          ...event,
          ability: submission.ability,
          casterId: casterId,
          targetId: submission.target.id,
        } as BattleBehavior);
      }

      const expiredEvent = await this.battle.decrementStatus(casterId);

      if (expiredEvent) {
        await this.onNewEvent({
          ...expiredEvent,
          ability: submission.ability,
          casterId: casterId,
          targetId: submission.target.id,
        } as BattleBehavior);
      }

      this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
      this.turn();
    }
  }

  async init() {
    await this.onNewEvent(
      battleBehavior.textMessage({
        text: "The battle is starting!",
      })
    );

    // Start the first turn
    this.turn();
  }
}
