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
};

export const Pizzas: Record<string, Pizza> = {
  s001: {
    name: "Slice Samurai",
    type: PizzaType.Spicy,
    src: "/images/characters/pizzas/s001.png",
    icon: "/images/icons/spicy.png",
  },
  v001: {
    name: "Call Me Kale",
    type: PizzaType.Veggie,
    src: "/images/characters/pizzas/v001.png",
    icon: "/images/icons/veggie.png",
  },
  f001: {
    name: "Portabello Express",
    type: PizzaType.Fungi,
    src: "/images/characters/pizzas/f001.png",
    icon: "/images/icons/fungi.png",
  },
};
