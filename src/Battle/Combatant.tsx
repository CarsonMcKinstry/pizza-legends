import "@/styles/Combatant.css";
import { UiElement } from "@/Ui/UiElement";
import { Battle, Team } from "./Battle";
import { PizzaType } from "@/Content/Pizzas";
import { CombatantDisplay, CombatantState } from "@/components/Combatant";
import { Pizza } from "@/components/Combatant/Pizza";

export type CombatantConfig = {
  actions: string[];
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
      storeConfig: () => {
        return config.state;
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
      <>
        <CombatantDisplay
          store={{
            battle: this.battle.store!,
            combatant: this.store!,
          }}
          id={this.id}
          name={this.name}
          type={this.type}
          src={this.src}
          icon={this.icon}
          team={this.team}
        />
        <Pizza src={this.src} name={this.name} team={this.team} />
      </>
    );
  }
}
