import "@/styles/Combatant.css";
import { UiElement } from "@/Ui/UiElement";
import { Battle, BattleContext, Team } from "./Battle";
import { PizzaType } from "@/Content/Pizzas";
import {
  CombatantContext,
  CombatantDisplay,
  CombatantState,
  CombatantSlice,
} from "@/components/Combatant";
import { Provider } from "react-redux";
import { Pizza } from "@/components/Combatant/Pizza";

export type CombatantConfig = {
  actions: any[];
  name: string;
  type: PizzaType;
  src: string;
  icon: string;
  id: string;
  team: Team;
};

export class Combatant extends UiElement<CombatantState> {
  actions: any[];
  override name: string;
  battle: Battle;
  type: PizzaType;
  src: string;
  icon: string;
  team: Team;
  id: string;

  constructor(
    config: CombatantConfig & {
      team: Team;
      state: CombatantState;
    },
    battle: Battle
  ) {
    super({
      name: "Combatant",
      onComplete() {},
      storeConfig: {
        preloadedState: config.state,
        reducer: CombatantSlice.reducer,
      },
    });

    this.name = config.name;
    this.actions = config.actions;
    this.battle = battle;
    this.type = config.type;
    this.src = config.src;
    this.icon = config.icon;
    this.id = config.id;
    this.team = config.team;
  }

  render() {
    return (
      <Provider context={BattleContext} store={this.battle.store!}>
        <Provider context={CombatantContext} store={this.store!}>
          <CombatantDisplay
            id={this.id}
            name={this.name}
            type={this.type}
            src={this.src}
            icon={this.icon}
            team={this.team}
          />
          <Pizza src={this.src} name={this.name} team={this.team} />
        </Provider>
      </Provider>
    );
  }
}
