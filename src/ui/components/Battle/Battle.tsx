import { useSelector } from "react-redux";
import { PizzaType } from "../../../Content/Pizzas";
import { Combatant } from "../Combatant";
import "./Battle.css";
import { Pizza } from "./Pizza";
import { UserInterfaceState } from "../../store";
import { BattleState } from "./state";

export const Battle = () => {
  const { isOpen, activeCombatants, combatants } = useSelector<
    UserInterfaceState,
    BattleState
  >((state) => state.battle);

  if (!isOpen) return null;

  // const player = combatants?.[activeCombatants.player];

  return (
    <div
      className="Battle"
      style={{
        backgroundImage: "url(/images/maps/StreetBattle.png)",
      }}
    >
      <div className="Battle_hero">
        <img
          src="/images/characters/people/hero.png"
          style={{
            backgroundImage: "url(/images/characters/shadow.png)",
          }}
        />
      </div>
      <div className="Battle_enemy">
        <img
          src="/images/characters/people/erio.png"
          style={{
            backgroundImage: "url(/images/characters/shadow.png)",
          }}
        />
      </div>
      {Object.entries(combatants ?? {}).map(([id, combatant]) => {
        const isActive = id === activeCombatants[combatant.team];
        return (
          <>
            <Combatant {...combatant} active={isActive} />
            <Pizza
              name={combatant.name}
              src={combatant.src}
              team={combatant.team}
              active={isActive}
            />
          </>
        );
      })}
    </div>
  );
};
