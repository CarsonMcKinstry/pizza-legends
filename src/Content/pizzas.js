import PizzaSamurai from "../images/characters/pizzas/s001.png";
import CallMeKale from "../images/characters/pizzas/v001.png";
import PortobelloExpress from "../images/characters/pizzas/f001.png";
import SpicyIcon from "../images/icons/spicy.png";
import VeggieIcon from "../images/icons/veggie.png";
import FungiIcon from "../images/icons/fungi.png";

export const PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill"
};

export const Pizzas = {
  s001: {
    name: "Slice Samurai",
    type: PizzaTypes.spicy,
    src: PizzaSamurai,
    icon: SpicyIcon,
    actions: ["clumsyStatus", "saucyStatus", "damage1"]
  },
  v001: {
    name: "Call Me Kale",
    type: PizzaTypes.veggie,
    src: CallMeKale,
    icon: VeggieIcon,
    actions: ["damage1"]
  },
  f001: {
    name: "Portobello Express",
    type: PizzaTypes.fungi,
    src: PortobelloExpress,
    icon: FungiIcon,
    actions: ["damage1"]
  }
};
