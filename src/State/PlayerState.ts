import { StoryFlag } from "@/Content/StoryFlags";
import { globalEvents } from "@/Inputs/GlobalEvents";
import { CombatantState, Item } from "@/types";

export class PlayerState {
  pizzas: Record<
    string,
    CombatantState & {
      pizzaId: string;
    }
  > = {
    p1: {
      pizzaId: "s001",
      hp: 1,
      maxHp: 50,
      xp: 99,
      maxXp: 100,
      level: 1,
    },
    p2: {
      pizzaId: "v001",
      hp: 51,
      maxHp: 50,
      xp: 99,
      maxXp: 100,
      level: 1,
    },
    p3: {
      pizzaId: "f001",
      hp: 51,
      maxHp: 50,
      xp: 99,
      maxXp: 100,
      level: 1,
    },
  };

  lineup: string[] = ["p1"];

  storyFlags: Partial<Record<StoryFlag, true>> = {};

  items: Omit<Item, "team">[] = [
    {
      actionId: "item_recoverStatus",
      instanceId: "p1",
    },
    {
      actionId: "item_recoverHp",
      instanceId: "p3",
    },
    {
      actionId: "item_recoverStatus",
      instanceId: "p2",
    },
    {
      actionId: "item_recoverStatus",
      instanceId: "p3",
    },
  ];

  swapLineup(oldId: string, incomingId: string) {
    this.lineup = this.lineup.map((id) => {
      if (id === oldId) {
        return incomingId;
      }

      return id;
    });
    globalEvents.emit("LineupChanged", {});
  }

  moveToFront(futureFrontId: string) {
    this.lineup = this.lineup.filter((id) => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);
    globalEvents.emit("LineupChanged", {});
  }

  addPizza(pizzaId: string) {
    const newId = `p${Date.now()}${Math.floor(Math.random() * 999999)}`;

    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
    };

    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }
    globalEvents.emit("LineupChanged", {});
  }
}

export const playerState = new PlayerState();
