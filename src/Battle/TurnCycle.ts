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

      const resultingEvents = submission.ability.success;

      for (const event of resultingEvents) {
        await this.onNewEvent({
          ...event,
          ability: submission.ability,
          casterId: casterId,
          targetId: submission.target.id,
        } as any);
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
