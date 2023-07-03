import "./Battle.css";
type BattleProps = {};

export const Battle = ({}: BattleProps) => {
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
      <div className="Combatant player active" data-combatant="s001">
        <p className="Combatant_name">Slice Samurai</p>
        <p className="Combatant_level">1</p>
        <div className="Combatant_character_crop">
          <img
            className="Combatant_character"
            alt=""
            src="/images/characters/pizzas/s001.png"
          />
        </div>
        <img className="Combatant_type" src="/images/icons/spicy.png" />
        <svg viewBox="0 0 26 3" className="Combatant_life-container">
          <rect x="0" y="0" width="50%" height="1" fill="#82ff71" />
          <rect x="0" y="1" width="50%" height="2" fill="#3ef126" />
        </svg>
        <svg viewBox="0 0 26 2" className="Combatant_xp-container">
          <rect x="0" y="0" width="50%" height="1" fill="#ffd76a" />
          <rect x="0" y="1" width="50%" height="1" fill="#ffc934" />
        </svg>
        <p className="Combatant_status saucy">Saucy</p>
      </div>
      <img
        className="Pizza player"
        src="/images/characters/pizzas/s001.png"
        style={{
          backgroundImage: "url(/images/characters/shadow.png)",
        }}
      />

      <div className="Combatant enemy active" data-combatant="v001">
        <p className="Combatant_name">Call Me Kale</p>
        <p className="Combatant_level">1</p>
        <div className="Combatant_character_crop">
          <img
            className="Combatant_character"
            alt=""
            src="/images/characters/pizzas/v001.png"
          />
        </div>
        <img className="Combatant_type" src="/images/icons/veggie.png" />
        <svg viewBox="0 0 26 3" className="Combatant_life-container">
          <rect x="0" y="0" width="50%" height="1" fill="#82ff71" />
          <rect x="0" y="1" width="50%" height="2" fill="#3ef126" />
        </svg>
        <svg viewBox="0 0 26 2" className="Combatant_xp-container">
          <rect x="0" y="0" width="50%" height="1" fill="#ffd76a" />
          <rect x="0" y="1" width="50%" height="1" fill="#ffc934" />
        </svg>
        <p className="Combatant_status clumsy">Clumsy</p>
      </div>
      <img
        className="Pizza enemy"
        src="/images/characters/pizzas/v001.png"
        style={{
          backgroundImage: "url(/images/characters/shadow.png)",
        }}
      />
    </div>
  );
};
