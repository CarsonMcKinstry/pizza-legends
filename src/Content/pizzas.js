import PizzaSamurai from "../images/characters/pizzas/s001.png";
import BaconBrigade from "../images/characters/pizzas/s002.png";
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
  chill: "chill",
};

export const Pizzas = {
  s001: {
    name: "Slice Samurai",
    description: "Pizza desc here",
    type: PizzaTypes.spicy,
    src: PizzaSamurai,
    icon: SpicyIcon,
    actions: ["clumsyStatus", "saucyStatus", "damage1"],
  },
  s002: {
    name: "Bacon Brigade",
    description: "Pizza desc here",
    type: PizzaTypes.spicy,
    src: BaconBrigade,
    icon: SpicyIcon,
    actions: ["clumsyStatus", "saucyStatus", "damage1"],
  },
  v001: {
    name: "Call Me Kale",
    description: "Pizza desc here",
    type: PizzaTypes.veggie,
    src: CallMeKale,
    icon: VeggieIcon,
    actions: ["damage1"],
  },
  f001: {
    name: "Portobello Express",
    description: "Pizza desc here",
    type: PizzaTypes.fungi,
    src: PortobelloExpress,
    icon: FungiIcon,
    actions: ["damage1"],
  },
};
