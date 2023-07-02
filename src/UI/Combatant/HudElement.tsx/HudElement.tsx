import "./HudElement.css";
import { StoreApi, useStore } from "zustand";
import { CombatantConfig, CombatantState } from "../Combatant";
import clsx from "clsx";

export type HudElementProps = {
  state: StoreApi<CombatantState>;
} & Omit<CombatantConfig, "state" | "actions">;

export const HudElement = ({
  state,
  name,
  src,
  icon,
  type,
  team,
}: HudElementProps) => {
  const store = useStore(state);

  const xpPercent = Math.floor((store.xp / store.maxXp) * 100);
  let hpPercent = Math.floor((store.hp / store.maxHp) * 100);
  if (hpPercent < 0) {
    hpPercent = 0;
  }

  if (!store.active) return null;

  return (
    <>
      <p className="Combatant_name">{name}</p>
      <p className="Combatant_level">{store.level}</p>
      <div className="Combatant_character_crop">
        <img className="Combatant_character" alt={name} src={src} />
      </div>
      <img className="Combatant_type" src={icon} alt={type} />
      <svg viewBox="0 0 26 3" className="Combatant_life-container">
        <rect x="0" y="0" width={`${hpPercent}%`} height="1" fill="#82ff71" />
        <rect x="0" y="1" width={`${hpPercent}%`} height="2" fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" className="Combatant_xp-container">
        <rect x="0" y="0" width={`${xpPercent}%`} height="1" fill="#ffd76a" />
        <rect x="0" y="1" width={`${xpPercent}%`} height="1" fill="#ffc934" />
      </svg>
      {store.status && (
        <p className={clsx("Combatant_status", store.status.type)}>
          {store.status.type}
        </p>
      )}
    </>
  );
};
