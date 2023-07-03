type BattleConfig = {
  onComplete: () => void;
};

export class Battle {
  onComplete: () => void;

  constructor(config: BattleConfig) {
    this.onComplete = config.onComplete;
  }
}
