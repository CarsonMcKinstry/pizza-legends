import { Combatant } from "@/Battle/Combatant";
import { Action, Actions } from "@/Content/Actions";
import React from "jsx-dom";

export type Submission = {
  action: Action;
  target: Combatant;
};

type SubmissionMenuConfig = {
  caster: Combatant;
  enemy: Combatant;
  onComplete: (submission: Submission) => void;
};

export class SubmissionMenu {
  caster: Combatant;
  enemy: Combatant;
  element?: HTMLElement;
  onComplete: (submission: Submission) => void;

  constructor({ caster, enemy, onComplete }: SubmissionMenuConfig) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  createElement() {}

  decide() {
    this.onComplete({
      action: Actions[this.caster.actions[0]],
      target: this.enemy,
    });
  }

  init(container: HTMLElement) {
    this.decide();
  }
}
