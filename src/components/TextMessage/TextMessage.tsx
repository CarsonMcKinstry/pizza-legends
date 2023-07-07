import { StoreApi, useStore } from "zustand";
import { RevealingText, RevealingTextState } from "../RevealingText";

export type TextMessageState = RevealingTextState & {
  textMessage?: {
    text: string;
  };
};

type TextMessageProps = {
  store: StoreApi<TextMessageState>;
  onContinue: () => void;
};

export const TextMessageDisplay = ({ onContinue, store }: TextMessageProps) => {
  const state = useStore(store);

  if (!state.textMessage) return null;

  return (
    <>
      <p className="TextMessage_p">
        <RevealingText
          store={store}
          text={state.textMessage?.text}
          onComplete={() => {
            if (!state.revealingText?.done) {
              store.setState({
                revealingText: {
                  done: true,
                },
              });
            }
          }}
        />
      </p>
      <button
        className="TextMessage_button"
        onClick={() => {
          onContinue();
        }}
      >
        Continue...
      </button>
    </>
  );
};
