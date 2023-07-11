import "@/styles/Team.css";
import { TeamType } from "@/types";
import React, { JSX } from "jsx-dom";
import { Combatant } from "./Combatant";

export class Team {
  element?: JSX.Element;
  team: TeamType;
  name: string;
  combatants: Combatant[] = [];

  constructor(team: TeamType, name: string) {
    this.team = team;
    this.name = name;
  }

  createElement() {
    this.element = <div className={["Team", this.team]}></div>;

    for (const combatant of this.combatants) {
      const icon = (
        <div className={`combatant-icon-${combatant.id}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            viewBox="0 -0.5 7 10"
            shape-rendering="crispEdges"
          >
            <path
              stroke="#3a160d"
              d="M2 0h3M1 1h1M5 1h1M0 2h1M6 2h1M0 3h1M6 3h1M0 4h1M6 4h1M1 5h1M5 5h1M2 6h3"
            />
            <path
              stroke="#e2b051"
              d="M2 1h1M4 1h1M1 2h1M5 2h1M1 4h1M5 4h1M2 5h1M4 5h1"
            />
            <path stroke="#ffd986" d="M3 1h1M2 2h3M1 3h5M2 4h3M3 5h1" />

            <path
              class="active-pizza-indicator"
              stroke="#3a160d"
              d="M3 8h1M2 9h3"
            />

            <path
              class="dead-pizza"
              stroke="#3a160d"
              d="M2 0h3M1 1h1M5 1h1M0 2h1M2 2h1M4 2h1M6 2h1M0 3h1M3 3h1M6 3h1M0 4h1M2 4h1M4 4h1M6 4h1M1 5h1M5 5h1M2 6h3"
            />
            <path class="dead-pizza" stroke="#9b917f" d="M2 1h3M1 2h1M5 2h1" />
            <path
              class="dead-pizza"
              stroke="#c4bdae"
              d="M3 2h1M1 3h2M4 3h2M1 4h1M3 4h1M5 4h1M2 5h3"
            />
          </svg>
        </div>
      );

      this.element.appendChild(icon);
    }
  }

  update() {
    for (const c of this.combatants) {
      const icon = this.element?.querySelector(`.combatant-icon-${c.id}`);

      if (c.state.hp <= 0) {
        icon?.classList.add("dead");
      } else {
        icon?.classList.remove("dead");
      }

      if (c.isActive) {
        icon?.classList.add("active");
      } else {
        icon?.classList.remove("active");
      }
    }
  }

  init(container: JSX.Element) {
    this.createElement();
    if (this.element) {
      this.update();
      container.appendChild(this.element);
    }
  }
}
