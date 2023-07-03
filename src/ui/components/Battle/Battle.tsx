import { PizzaType } from "../../../Content/Pizzas";
import { Combatant } from "../Combatant";
import "./Battle.css";
import { Pizza } from "./Pizza";

export const Battle = () => {
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
      <Combatant
        name="Slice Samurai"
        level={1}
        src="/images/characters/pizzas/s001.png"
        hp={40}
        maxHp={50}
        xp={0}
        maxXp={100}
        icon="/images/icons/spicy.png"
        type={PizzaType.Spicy}
        active
        team="player"
      />
      <Pizza
        name="Slice Samurai"
        src="/images/characters/pizzas/s001.png"
        team="player"
        active
      />
      <Combatant
        name="Call Me Kale"
        level={1}
        src="/images/characters/pizzas/v001.png"
        hp={40}
        maxHp={50}
        xp={0}
        maxXp={100}
        icon="/images/icons/veggie.png"
        type={PizzaType.Veggie}
        active
        team="enemy"
      />
      <Pizza
        name="Call me Kale"
        src="/images/characters/pizzas/v001.png"
        team="enemy"
        active
      />
    </div>
  );
};
