import "./Battle.css";
import { UiElement } from "../UiElement";
import { Combatant } from "../Combatant";
import { Pizzas } from "../Content/Pizzas";

type BattleConfig = {
  onComplete: () => void;
};

type ActiveCombatants = {
  player: string;
  enemy: string;
};

export class Battle extends UiElement<{ activeCombatants: ActiveCombatants }> {
  combatants: Record<string, Combatant>;
  onComplete: () => void;

  constructor(config: BattleConfig) {
    super("Battle");
    this.onComplete = config.onComplete;

    this.combatants = {
      player1: new Combatant(
        {
          ...Pizzas.s001,
          team: "player",
          state: {
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: {
              type: "clumsy",
              expiresIn: 3,
            },
          },
          actions: [],
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...Pizzas.v001,
          team: "enemy",
          state: {
            hp: 20,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
          },
          actions: [],
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...Pizzas.f001,
          team: "enemy",
          state: {
            hp: 50,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
          },
          actions: [],
        },
        this
      ),
    };

    // this.state = createStore<{
    //   activeCombatants: ActiveCombatants;
    // }>(() => ({
    //   activeCombatants: {
    //     player: "player1",
    //     enemy: "enemy1",
    //   },
    // }));
  }

  override render() {
    return <BattleField state={this.state!} combatants={this.combatants} />;
  }

  override bindActionListeners(): void {}
}

type BattleFieldProps = {
  state: StoreApi<{ activeCombatants: ActiveCombatants }>;
  combatants: Record<string, Combatant>;
};

export const BattleField = ({ state, combatants }: BattleFieldProps) => {
  const store = useStore(state);
  console.log(store);
  return (
    <>
      <div className="Battle_hero">
        <img src="/images/characters/people/hero.png" alt="Hero" />
      </div>
      <div className="Battle_enemy">
        <img src="/images/characters/people/npc3.png" alt="Hero" />
      </div>
      {Object.entries(combatants).map(([key, combatant]) => {
        combatant.id = key;
        combatant.update({
          active: store.activeCombatants[combatant.team] === key,
        });

        return combatant.render();
      })}
    </>
  );
};
