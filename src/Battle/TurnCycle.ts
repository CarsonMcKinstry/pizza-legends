import {
  BattleBehaviorType,
  BattleBehaviors,
} from "@/Behaviors/BattleBehaviors";
import { Battle } from "./Battle";
import { Submission } from "@/Ui/SubmissionMenu";
import { TeamType } from "@/types";
import { Combatant } from "./Combatant";

type TurnCycleConfig<R = void> = {
  battle: Battle;
  onNewEvent: (event: BattleBehaviorType) => Promise<R>;
  onWinner: (winner: TeamType) => void;
};

export class TurnCycle {
  battle: Battle;
  onNewEvent: <R = void>(event: BattleBehaviorType) => Promise<R>;
  currentTeam: TeamType = "player";
  onWinner: (winner: TeamType) => void;

  constructor({ battle, onNewEvent, onWinner }: TurnCycleConfig) {
    this.battle = battle;
    this.onNewEvent = onNewEvent as typeof this.onNewEvent;
    this.onWinner = onWinner;
  }

  async turn() {
    // Get the caster

    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId!];
    const enemyId =
      this.battle.activeCombatants[
        caster.team === "player" ? "enemy" : "player"
      ];
    const enemy = this.battle.combatants[enemyId!];

    const submission = await this.onNewEvent<Submission>(
      BattleBehaviors.submissionMenu({
        caster,
        enemy,
      })
    );

    if (submission.replacement) {
      await this.onNewEvent(
        BattleBehaviors.replace({
          replacement: submission.replacement,
        })
      );
      await this.onNewEvent(
        BattleBehaviors.textMessage({
          text: `Go get 'em ${submission.replacement.name}!`,
        })
      );
      this.nextTurn();
      return;
    }

    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;

      this.battle.items = this.battle.items.filter(
        (item) => item.instanceId !== submission.instanceId
      );
    }

    const resultingEvents = caster.getReplacedEvents(
      submission.action?.success ?? []
    );

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

    // Did the target die?
    const isTargetDead = submission.target!.state.hp <= 0;
    if (isTargetDead) {
      await this.onNewEvent(
        BattleBehaviors.textMessage({
          text: `${submission.target!.name} is ruined!`,
        })
      );

      if (submission.target?.team === "enemy") {
        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;

        await this.onNewEvent(
          BattleBehaviors.textMessage({
            text: `Gained ${xp} xp`,
          })
        );
        await this.onNewEvent(
          BattleBehaviors.giveXp({
            xp,
            combatant: this.battle.combatants[playerActivePizzaId!],
          })
        );
      }
    }

    // Do we have a winning team?
    // End the battle ->

    const winner = this.getWinningTeam();
    // Dead target, no winner, bring in replacement

    if (winner) {
      await this.onNewEvent(
        BattleBehaviors.textMessage({
          text: "Winner!",
        })
      );

      // end the battle

      this.onWinner(winner);
      return;
    }

    if (isTargetDead) {
      const replacement = await this.onNewEvent<Combatant>(
        BattleBehaviors.replacementMenu({
          team: submission.target!.team,
        })
      );

      await this.onNewEvent(
        BattleBehaviors.replace({
          replacement,
        })
      );

      await this.onNewEvent(
        BattleBehaviors.textMessage({
          text: `${replacement.name} appears!`,
        })
      );

      this.currentTeam = "player";
      this.turn();
      return;
    }

    // Check for post events
    // (do stuff AFTER the original turn submission)
    const postEvents = caster.getPostEvents();
    for (const rawEvent of postEvents) {
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

    // check for status expiration
    const expiredEvent = caster.decrementStatus();

    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.nextTurn();
  }

  getWinningTeam(): TeamType | void {
    const aliveTeams: Record<TeamType, boolean> = {
      player: false,
      enemy: false,
    };

    for (const combatant of Object.values(this.battle.combatants)) {
      if (combatant.state.hp > 0) {
        aliveTeams[combatant.team] = true;
      }
    }

    if (!aliveTeams.player) return "enemy";
    if (!aliveTeams.enemy) return "player";
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  async init() {
    await this.onNewEvent(
      BattleBehaviors.textMessage({
        text: `${this.battle.enemy.name} wants to battle!`,
      })
    );

    this.turn();
  }
}
