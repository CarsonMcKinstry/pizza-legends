import { Pizzas } from "../Content/Pizzas";
import { SceneController } from "../SceneController";
import { Team } from "../types";
import { BattleActions } from "../ui/components/Battle/state";
import { BattleBehavior } from "./BattleBehaviors";
import { BattleEvent } from "./BattleEvent";
import { TurnCycle } from "./TurnCycle";

type BattleConfig = {
  onComplete: () => void;
};

export class Battle {
  onComplete: () => void;
  scene: SceneController;
  turnCycle?: TurnCycle;

  constructor(config: BattleConfig, scene: SceneController) {
    this.onComplete = config.onComplete;
    this.scene = scene;
  }

  get activeCombatants() {
    return this.scene.game?.userInterface.store.getState().battle
      .activeCombatants;
  }

  get combatants() {
    return this.scene.game?.userInterface.store.getState().battle.combatants;
  }

  damage(damage: number, targetId: string) {
    this.scene.game?.userInterface.dispatch(
      BattleActions.damage({
        damage,
        targetId,
      })
    );
  }

  stopBlinking() {
    this.scene.game?.userInterface.dispatch(BattleActions.stopBlinking());
  }

  startAnimation(animation: {
    animation: string;
    team: Team;
    onComplete: () => void;
  }) {
    this.scene.game?.userInterface.dispatch(
      BattleActions.startAnimation(animation)
    );
  }

  stopAnimation() {
    this.scene.game?.userInterface.dispatch(BattleActions.animationEnded());
  }

  init() {
    this.scene.game?.userInterface.dispatch(
      BattleActions.start({
        combatants: {
          player1: {
            ...Pizzas.s001,
            id: "player1",
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: {
              type: "clumsy",
              expiresIn: 3,
            },
            team: "player",
          },
          enemy1: {
            ...Pizzas.v001,
            id: "enemy1",
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            team: "enemy",
            status: {
              type: "saucy",
              expiresIn: 3,
            },
          },
          enemy2: {
            ...Pizzas.f001,
            id: "enemy2",
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            team: "enemy",
          },
        },
        activeCombatants: {
          player: "player1",
          enemy: "enemy1",
        },
      })
    );

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: async (event: BattleBehavior) => {
        return new Promise<any>((resolve) => {
          const battleEvent = new BattleEvent({
            battle: this,
            event,
          });

          battleEvent.init(resolve);
        });
      },
    });

    this.turnCycle.init();
  }
}
