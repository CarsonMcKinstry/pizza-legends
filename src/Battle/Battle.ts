import { Pizzas } from "../Content/Pizzas";
import { SceneController } from "../SceneController";
import { CombatantStatus, StatusAilment, Team } from "../types";
import { BattleActions } from "../ui/components/Battle/state";
import { randomFromArray } from "../utils/randomFromArray";
import { wait } from "../utils/wait";
import { BattleBehavior, battleBehavior } from "./BattleBehaviors";
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

  recover(recover: number, targetId: string) {
    this.scene.game?.userInterface.dispatch(
      BattleActions.recover({
        amount: recover,
        targetId,
      })
    );
  }

  statusChange(changes: {
    status: CombatantStatus;
    targetId: string;
    casterId: string;
  }) {
    this.scene.game?.userInterface.dispatch(
      BattleActions.statusChange(changes)
    );
  }

  async decrementStatus(whoId: string) {
    let who = this.combatants![whoId];

    if (who && who.status && who.status.expiresIn > 0) {
      this.statusChange({
        status: {
          ...who.status,
          expiresIn: who.status.expiresIn - 1,
        },
        casterId: whoId,
        targetId: whoId,
      });

      who = this.combatants![whoId];

      if (who.status && who.status.expiresIn === 0) {
        await wait(800);
        this.scene.game?.userInterface.dispatch(
          BattleActions.statusExpired(whoId)
        );

        return battleBehavior.textMessage({
          text: `${
            who.status.type.charAt(0).toUpperCase() + who.status.type.slice(1)
          } expired!`,
        });
      }
    }
  }

  stopBlinking() {
    this.scene.game?.userInterface.dispatch(BattleActions.stopBlinking());
  }

  startAnimation(animation: {
    color?: string;
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

  getPostEvents(casterId: string): BattleBehavior[] {
    const caster = this.combatants![casterId];

    if (caster && caster.status) {
      if (caster.status.type === "saucy") {
        return [
          battleBehavior.textMessage({ text: "Feelin' saucy!" }),
          battleBehavior.stateChange({ recover: 5, onCaster: true }),
        ];
      }
    }

    return [];
  }

  getReplacedEvents(
    casterId: string,
    events: BattleBehavior[]
  ): BattleBehavior[] {
    const caster = this.combatants![casterId];

    if (
      caster &&
      caster.status?.type === "clumsy" &&
      randomFromArray([true, false, false])
    ) {
      return [
        battleBehavior.textMessage({
          text: `${caster.name} flops over!`,
        }),
      ];
    }

    return events;
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
              type: "clumsy",
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
