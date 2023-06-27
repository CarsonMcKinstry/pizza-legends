import Erio from "../images/characters/people/erio.png";
import Beth from "../images/characters/people/npc1.png";

export const Enemies = {
  erio: {
    name: "Erio",
    src: Erio,
    pizzas: {
      a: {
        pizzaId: "s001",
        maxHp: 50,
        level: 1,
        // other configuration could go here?
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
    src: Beth,
    pizzas: {
      a: {
        hp: 1,
        pizzaId: "f001",
        maxHp: 50,
        level: 1,
      },
    },
  },
};
