import { Enemy } from "@/types";

export const Enemies: Record<string, Enemy> = {
  erio: {
    name: "Erio",
    spriteName: "erio",
    pizzas: {
      a: {
        pizzaId: "s001",
        maxHp: 50,
        level: 1,
      },
      b: {
        pizzaId: "s002",
        maxHp: 50,
        level: 1,
      },
    },
  },
  beth: {
    name: "Beth",
    spriteName: "npc1",
    pizzas: {
      a: {
        pizzaId: "v001",
        hp: 1,
        maxHp: 50,
        level: 1,
      },
    },
  },
};
