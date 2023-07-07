import { StoreApi, useStore } from "zustand";

import { TextMessageDisplay, TextMessageState } from "../TextMessage";

type BattleUiProps = {
  store: StoreApi<BattleUiState>;
};

export type BattleUiState = TextMessageState;

export const BattleUi = ({ store }: BattleUiProps) => {
  const state = useStore(store);

  return (
    <>
      {!!state.textMessage && (
        <div className="TextMessage">
          <TextMessageDisplay
            store={store}
            onContinue={() => {
              store.setState({
                textMessage: undefined,
                revealingText: undefined,
              });
            }}
          />
        </div>
      )}
    </>
  );
};
