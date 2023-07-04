import { Abilities, Ability } from "../../Content/Abilities";
import { CombatantState } from "../components/Combatant/types";

export type Submission = {
  ability: Ability;
  target: CombatantState;
};

type SubmissionMenuConfig = {
  caster: CombatantState;
  enemy: CombatantState;
  onComplete: (submission: Submission) => void;
};

export class SubmissionMenu {
  enemy: CombatantState;
  caster: CombatantState;
  onComplete: (submission: Submission) => void;

  constructor({ caster, enemy, onComplete }: SubmissionMenuConfig) {
    this.caster = caster;
    this.onComplete = onComplete;
    this.enemy = enemy;
  }

  decide() {
    const ability = Abilities[this.caster.abilities[0]];

    this.onComplete({
      ability,
      target: ability.targetType === "friendly" ? this.caster : this.enemy,
    });
  }

  init() {
    this.decide();
  }
}
