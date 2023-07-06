import clsx from "clsx";
import { PizzaType } from "@/Content/Pizzas";
import { Team, useIsActiveCombatant } from "@/Battle/Battle";
import { useCombatantState } from "./state";

type CombatantProps = {
  id: string;
  name: string;
  src: string;
  icon: string;
  type: PizzaType;
  team: Team;
};

export const CombatantDisplay = ({
  name,
  src,
  icon,
  type,
  team,
  id,
}: CombatantProps) => {
  const { level, hpPercentage, xpPercentage, status } = useCombatantState();

  const isActive = useIsActiveCombatant(id, team);

  if (!isActive) return null;

  return (
    <div className={clsx("Combatant", team)}>
      <p className="Combatant_name">{name}</p>
      <p className="Combatant_level">{level}</p>
      <div className="Combatant_character_crop">
        <img className="Combtant_character" alt={name} src={src} />
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
