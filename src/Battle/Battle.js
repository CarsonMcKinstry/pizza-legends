import "../styles/Battle.css";
import Hero from "../images/characters/people/hero.png";
import Enemy from "../images/characters/people/npc3.png";
import Background from "../images/maps/StreetBattle.png";
import Shadow from "../images/characters/shadow.png";
import { Combatant } from "./Combatant";
import { Pizzas } from "../Content/pizzas";
import { TurnCycle } from "./TurnCycle";
import { BattleEvent } from "./BattleEvent";
import { Team } from "./Team";
import { playerState } from "../State/PlayerState";
import { emitEvent } from "../utils";

export class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {};

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    playerState.lineup.forEach((id) => {
      this.addCombatant(id, "player", playerState.pizzas[id]);
    });

    Object.keys(this.enemy.pizzas).forEach((id) => {
      this.addCombatant("e_" + id, "enemy", this.enemy.pizzas[id]);
    });

    this.items = [];

    playerState.inventory.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant(
      {
        ...Pizzas[config.pizzaId],
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    this.activeCombatants[team] = this.activeCombatants[team] ?? id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.style.backgroundImage = `url(${Background})`;

    this.element.innerHTML = `
      <div class="Battle_hero">
        <img src="${Hero}" alt="Hero" style="background-image: url(${Shadow})"/>
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" style="background-image: url(${Shadow})"/>
      </div>
    `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: (winner) => {
        if (winner === "player") {
          const _playerState = playerState;

          Object.keys(_playerState.pizzas).forEach((id) => {
            const playerStatePizza = _playerState.pizzas[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.level = combatant.level;
            }
          });

          playerState.inventory = playerState.inventory.filter((item) => {
            return !this.usedInstanceIds[item.instanceId];
          });

          // send signal to update
          emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      },
    });

    this.turnCycle.init();
  }
}
