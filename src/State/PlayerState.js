import { emitEvent } from "../utils";

class PlayerState {
  constructor() {
    this.pizzas = {
      p1: {
        pizzaId: "s001",
        hp: 1,
        maxHp: 50,
        xp: 90,
        maxXp: 100,
        level: 1,
        status: null,
      },
      p2: {
        pizzaId: "v001",
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
      p3: {
        pizzaId: "f001",
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
      },
    };

    this.lineup = ["p1"];

    this.inventory = [
      {
        actionId: "item_recoverHp",
        instanceId: "item1",
      },
    ];

    this.storyFlags = {};
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    emitEvent("LineupChanged");
  }

  moveToFront(futureId) {
    this.lineup = this.lineup.filter((id) => id !== futureId);
    this.lineup.unshift(futureId);

    emitEvent("LineupChanged");
  }

  addPizza(pizzaId) {
    const newId = `p${Date.now()}` + Math.floor(Math.random() * 99999);
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };
    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }
    emitEvent("LineupChanged");
    console.log(this);
  }
}

export const playerState = new PlayerState();
