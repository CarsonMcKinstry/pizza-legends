import { Abilities } from "./Abilities";

export enum PizzaType {
  Normal = "normal",
  Spicy = "spicy",
  Veggie = "veggie",
  Fungi = "fungi",
  Chill = "chill",
}

export type Pizza = {
  name: string;
  type: PizzaType;
  src: string;
  icon: string;
  abilities: (keyof typeof Abilities)[];
};

export const Pizzas: Record<string, Pizza> = {
  s001: {
    name: "Slice Samurai",
    type: PizzaType.Spicy,
    src: "/images/characters/pizzas/s001.png",
    icon: "/images/icons/spicy.png",
    abilities: ["damage1"],
  },
  v001: {
    name: "Call Me Kale",
    type: PizzaType.Veggie,
    src: "/images/characters/pizzas/v001.png",
    icon: "/images/icons/veggie.png",
    abilities: ["damage1"],
  },
  f001: {
    name: "Portabello Express",
    type: PizzaType.Fungi,
    src: "/images/characters/pizzas/f001.png",
    icon: "/images/icons/fungi.png",
    abilities: ["damage1"],
  },
};
