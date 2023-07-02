import { createStore, useStore } from "zustand";
import { Battle } from "../Battle";
import { Pizza, PizzaType } from "../Content/Pizzas";
import { UiElement } from "../UiElement";
import { HudElement, HudElementProps } from "./HudElement.tsx/HudElement";
import clsx from "clsx";

export type CombatantState = {
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  status?: {
    type: "saucy" | "clumsy";
    expiresIn: number;
  };
  active?: boolean;
};

export type CombatantConfig = Pizza & {
  name: string;
  actions: any[];
  team: "player" | "enemy";
  state: CombatantState;
};

export class Combatant extends UiElement<CombatantState> {
  battle: Battle;

  actions: any[];
  team: "player" | "enemy";

  icon: string;
  src: string;
  type: PizzaType;

  status = null;

  combatantName: string;
  id: string | null = null;

  constructor(config: CombatantConfig, battle: Battle) {
    super("Combatant");
    this.battle = battle;

    this.state = createStore<CombatantState>(() => ({
      ...config.state,
    }));

    this.combatantName = config.name;
    this.actions = config.actions;
    this.icon = config.icon;
    this.src = config.src;
    this.type = config.type;
    this.team = config.team;
  }

  update(changes: Partial<CombatantState>) {
    this.state?.setState(changes);
  }

  override render() {
    return (
      <CombatantElement
        state={this.state!}
        name={this.combatantName}
        type={this.type}
        src={this.src}
        icon={this.icon}
        team={this.team}
      />
    );
  }

  override bindActionListeners(): void {}
}

type CombatantElementProps = HudElementProps;

export const CombatantElement = ({
  state,
  name,
  type,
  src,
  icon,
  team,
}: CombatantElementProps) => {
  const store = useStore(state);
  if (!store.active) {
    return null;
  }

  return (
    <div
      className={clsx("Combatant", team, {
        active: store.active,
      })}
    >
      <HudElement
        state={state!}
        name={name}
        type={type}
        src={src}
        icon={icon}
        team={team}
      />
      <img
        src={src}
        className={clsx("Pizza", team, {
          active: store.active,
        })}
        alt={name}
      />
    </div>
  );
};
