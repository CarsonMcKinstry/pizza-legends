import { Pizzas } from "../../Content/Pizzas";
import { SceneController } from "../../SceneController";
import { BattleActions } from "../components/Battle/state";

type BattleConfig = {
  onComplete: () => void;
};

export class Battle {
  onComplete: () => void;
  scene: SceneController;

  constructor(config: BattleConfig, scene: SceneController) {
    this.onComplete = config.onComplete;
    this.scene = scene;
  }

  init() {
    this.scene.game?.userInterface.dispatch(
      BattleActions.start({
        combatants: {
          player1: {
            ...Pizzas.s001,
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
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            team: "enemy",
          },
          enemy2: {
            ...Pizzas.f001,
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
  }
}
