import "./Combatant.css";
import clsx from "clsx";
import { CombatantStatus, Team } from "../../../types";
import { clamp } from "../../../utils/clamp";
import { PizzaType } from "../../../Content/Pizzas";

type CombatantProps = {
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  status?: CombatantStatus;
  active: boolean;
  team: Team;
  icon: string;
  src: string;
  name: string;
  type: PizzaType;
};

export const Combatant = ({
  hp,
  maxHp,
  team,
  active,
  xp,
  maxXp,
  name,
  level,
  src,
  icon,
  status,
  type,
}: CombatantProps) => {
  const hpPercentage = clamp(Math.floor((hp / maxHp) * 100), 0, 100);
  const xpPercentage = clamp(Math.floor((xp / maxXp) * 100), 0, 100);

  return (
    <div className={clsx("Combatant", team, { active })}>
      <p className="Combatant_name">{name}</p>
      <p className="Combatant_level">{level}</p>
      <div className="Combatant_character_crop">
        <img className="Combatant_character" alt={name} src={src} />
      </div>
      <img className="Combatant_type" src={icon} alt={type} />
      <svg viewBox="0 0 26 3" className="Combatant_life-container">
        <rect
          x="0"
          y="0"
          width={`${hpPercentage}%`}
          height="1"
          fill="#82ff71"
        />
        <rect
          x="0"
          y="1"
          width={`${hpPercentage}%`}
          height="2"
          fill="#3ef126"
        />
      </svg>
      <svg viewBox="0 0 26 2" className="Combatant_xp-container">
        <rect
          x="0"
          y="0"
          width={`${xpPercentage}%`}
          height="1"
          fill="#ffd76a"
        />
        <rect
          x="0"
          y="1"
          width={`${xpPercentage}%`}
          height="1"
          fill="#ffc934"
        />
      </svg>
      {status && (
        <p className={clsx("Combatant_status", status.type)}>{status.type}</p>
      )}
    </div>
  );
};
