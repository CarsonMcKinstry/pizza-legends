import { CombatantConfig } from "@/Battle/Combatant";

export enum PizzaType {
  Normal = "normal",
  Spicy = "spicy",
  Veggie = "veggie",
  Fungi = "fungi",
  Chill = "chill",
}

export const Pizzas: Record<string, Omit<CombatantConfig, "id" | "team">> = {
  s001: {
    name: "Slice Samurai",
    type: PizzaType.Spicy,
    src: "./images/characters/pizzas/s001.png",
    icon: "/images/icons/spicy.png",
    actions: [],
  },
  v001: {
    name: "Slice Samurai",
    type: PizzaType.Veggie,
    src: "./images/characters/pizzas/v001.png",
    icon: "/images/icons/veggie.png",
    actions: [],
  },
  f001: {
    name: "Portabello Express",
    type: PizzaType.Fungi,
    src: "./images/characters/pizzas/f001.png",
    icon: "/images/icons/fungi.png",
    actions: [],
  },
};
