import "../styles/Battle.css";
import Hero from "../images/characters/people/hero.png";
import Enemy from "../images/characters/people/npc3.png";
import Background from "../images/maps/StreetBattle.png";
import Shadow from "../images/characters/shadow.png";
import { Combatant } from "./Combatant";
import { Pizzas } from "../Content/pizzas";
import { TurnCycle } from "./TurnCycle";
import { BattleEvent } from "./BattleEvent";

export class Battle {
  constructor() {
    this.combatants = {
      player1: new Combatant(
        {
          ...Pizzas["s001"],
          hp: 50,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
          status: null,
          team: "player",
          isPlayerControlled: true,
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...Pizzas["s001"],
          team: "enemy",
          hp: 50,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...Pizzas["f001"],
          team: "enemy",
          hp: 50,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
        },
        this
      ),
    };

    this.activeCombatants = {
      player: "player1",
      enemy: "enemy2",
    };

    this.items = [
      {
        actionId: "item_recoverStatus",
        instanceId: "p1",
        team: "player",
      },
      {
        actionId: "item_recoverStatus",
        instanceId: "p2",
        team: "player",
      },
      {
        actionId: "item_recoverStatus",
        instanceId: "p3",
        team: "enemy",
      },
      {
        actionId: "item_recoverHp",
        instanceId: "p4",
        team: "player",
      },
    ];
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
        <img src="${Enemy}" alt="Hero" style="background-image: url(${Shadow})"/>
      </div>
    `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
    });

    this.turnCycle.init();
  }
}
