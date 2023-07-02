import "./TextMessage.css";
import { useDispatch, useSelector } from "react-redux";
import { UserInterfaceState } from "../../store";
import { TextMessageActions, TextMessageState } from "./state";

import { RevealingText } from "./RevealingText";

export const TextMessage = () => {
  const dispatch = useDispatch();
  const { isOpen, text, onComplete, isRevealingTextDone } = useSelector<
    UserInterfaceState,
    TextMessageState
  >((state) => state.textMessage);

  if (!isOpen) return null;

  return (
    <div className="TextMessage">
      <p className="TextMessage_p">
        <RevealingText
          text={text!}
          isDone={isRevealingTextDone}
          onComplete={() => {
            dispatch(TextMessageActions.done());
          }}
        />
      </p>
      <button
        className="TextMessage_button"
        onClick={() => {
          onComplete?.();
        }}
      >
        Continue...
      </button>
    </div>
  );
};
