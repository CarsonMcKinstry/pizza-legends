import { DetailedAction } from "./createBehaviorHandler/action";
import { createBehaviorHandler } from "./createBehaviorHandler";
import { BattleEvent } from "@/Battle/BattleEvent";
import { KeyPressListener } from "@/Inputs/KeyPressListener";

export const battleBehaviorHandler = createBehaviorHandler({
  exampleState: {} as BattleEvent,
  handlers: {
    textMessage(battleEvent, action: DetailedAction<{ text: string }>) {
      const { text } = action.details;

      let finished = false;

      const unsub = battleEvent.battle.battleUiStore.subscribe(
        (state, prevState) => {
          if (!prevState.revealingText?.done && !!state.revealingText?.done) {
            finished = true;
          }
        }
      );

      // acts as this.done
      const listener = new KeyPressListener("Enter", () => {
        if (finished) {
          battleEvent.resolve?.();
          listener.unbind();
          unsub();
          battleEvent.battle.battleUiStore.setState({
            textMessage: undefined,
            revealingText: {
              done: false,
            },
          });
        } else {
          battleEvent.battle.battleUiStore.setState({
            revealingText: {
              done: true,
            },
          });
          finished = true;
        }
      });

      battleEvent.battle.battleUiStore.setState({
        textMessage: {
          text,
        },
        revealingText: {
          done: false,
        },
      });
    },
    animation(_state, _action: DetailedAction<{ name: string }>) {},
    damage(_state, _action: DetailedAction<{ damage: number }>) {},
  },
});

export type BattleBehaviorType = ReturnType<
  (typeof battleBehaviorHandler.actions)[keyof typeof battleBehaviorHandler.actions]
>;

export const BattleBehaviors = battleBehaviorHandler.actions;
