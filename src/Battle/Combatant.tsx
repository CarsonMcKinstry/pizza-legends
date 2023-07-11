import "@/styles/Combatant.css";
import "@/styles/Pizza.css";
import { Battle } from "./Battle";
import { PizzaType } from "@/Content/Pizzas";
import React, { JSX } from "jsx-dom";
import { clamp, randomFromArray } from "@/utils";
import {
  BattleBehaviorType,
  BattleBehaviors,
} from "@/Behaviors/BattleBehaviors";
import { CombatantState, CombatantStatus, Status, TeamType } from "@/types";

export type CombatantConfig = {
  actions: string[];
  name: string;
  type: PizzaType;
  src: string;
  icon: string;
  team?: TeamType;
  isPlayerControlled?: true;
  state: CombatantState;
};

export class Combatant {
  hudElement?: JSX.Element;
  pizzaElement?: JSX.Element;
  levelElement?: HTMLElement;

  xpFills?: JSX.Element[];
  hpFills?: JSX.Element[];

  actions: string[];
  name: string;
  battle?: Battle;
  type: PizzaType;
  src: string;
  icon: string;
  team?: TeamType;
  id?: string;

  isPlayerControlled = false;

  state: {
    hp: number;
    maxHp: number;
    xp: number;
    maxXp: number;
    level: number;
    status?: CombatantStatus;
  };

  constructor(config: CombatantConfig, battle?: Battle) {
    this.name = config.name;
    this.actions = config.actions;
    this.battle = battle;
    this.type = config.type;
    this.src = config.src;
    this.icon = config.icon;
    this.team = config.team;
    this.state = config.state;
    this.isPlayerControlled =
      config.isPlayerControlled ?? this.isPlayerControlled;
  }

  get hpPercentage() {
    return clamp(Math.floor((this.state.hp / this.state.maxHp) * 100), 0, 100);
  }

  get xpPercentage() {
    return Math.floor((this.state.xp / this.state.maxXp) * 100);
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team!] === this.id;
  }

  get givesXp() {
    return this.state.level * 20;
  }

  getPostEvents(): BattleBehaviorType[] {
    if (this.state.status?.type === "saucy") {
      return [
        BattleBehaviors.textMessage({
          text: "Feelin' Saucy!",
        }),
        BattleBehaviors.stateChange({
          recover: 5,
          onCaster: true,
        }),
      ];
    }

    return [];
  }

  decrementStatus() {
    if (
      this.state.status?.expiresIn !== undefined &&
      this.state.status?.expiresIn > 0
    ) {
      this.state.status.expiresIn -= 1;
      if (this.state.status.expiresIn === 0) {
        const action = BattleBehaviors.textMessage({
          text: `${this.state.status.type
            .charAt(0)
            .toUpperCase()}${this.state.status.type.slice(1)} expired!`,
        });
        this.update({
          status: undefined,
        });
        return action;
      }
    }
  }

  createElement() {
    this.hudElement = (
      <div
        className={[
          "Combatant",
          this.team,
          {
            active: this.isActive,
          },
        ]}
      >
        <p className="Combatant_name">{this.name}</p>
        <p className="Combatant_level">{this.state.level}</p>
        <div className="Combatant_character_crop">
          <img className="Combatant_character" alt={this.name} src={this.src} />
        </div>
        <img className="Combatant_type" src={this.icon} alt={this.type} />
        <svg viewBox="0 0 26 3" className="Combatant_life-container">
          <rect
            x="0"
            y="0"
            width={`${this.hpPercentage}%`}
            height="1"
            fill="#82ff71"
          />
          <rect
            x="0"
            y="1"
            width={`${this.hpPercentage}%`}
            height="2"
            fill="#3ef126"
          />
        </svg>
        <svg viewBox="0 0 26 2" className="Combatant_xp-container">
          <rect
            x="0"
            y="0"
            width={`${this.xpPercentage}%`}
            height="1"
            fill="#ffd76a"
          />
          <rect
            x="0"
            y="1"
            width={`${this.xpPercentage}%`}
            height="1"
            fill="#ffc934"
          />
        </svg>
        <p
          className={[
            "Combatant_status",
            this.state.status && this.state.status.type,
          ]}
        >
          {this.state.status && this.state.status.type}
        </p>
      </div>
    );

    this.pizzaElement = (
      <img
        className={[
          "Pizza",
          this.team,
          {
            active: this.isActive,
          },
        ]}
        src={this.src}
        alt={this.name}
      />
    );

    this.hpFills = Array.from(
      this.hudElement.querySelectorAll(".Combatant_life-container > rect")
    );

    this.xpFills = Array.from(
      this.hudElement.querySelectorAll(".Combatant_xp-container > rect")
    );

    this.levelElement = this.hudElement.querySelector(
      ".Combatant_level"
    ) as HTMLElement;
  }

  update(changes: Partial<CombatantState>) {
    this.state = {
      ...this.state,
      ...changes,
    };

    if (this.isActive) {
      this.hudElement?.classList.add("active");
      this.pizzaElement?.classList.add("active");
    } else {
      this.hudElement?.classList.remove("active");
      this.pizzaElement?.classList.remove("active");
    }

    this.hpFills?.forEach((fill) => {
      fill.setAttribute("width", `${this.hpPercentage}%`);
    });

    this.xpFills?.forEach((fill) => {
      fill.setAttribute("width", `${this.xpPercentage}%`);
    });

    this.levelElement!.innerText = this.state.level.toString();

    const statusElement = this.hudElement!.querySelector(
      ".Combatant_status"
    ) as HTMLElement;

    if (this.state.status) {
      statusElement.innerText = this.state.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents: BattleBehaviorType[]) {
    if (
      this.state.status?.type === Status.Clumsy &&
      randomFromArray([true, false, false])
    ) {
      return [
        BattleBehaviors.textMessage({
          text: `${this.name} flops over!`,
        }),
      ];
    }

    return originalEvents;
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.hudElement && this.pizzaElement) {
      container.appendChild(this.hudElement);
      container.appendChild(this.pizzaElement);
    }
  }
}
