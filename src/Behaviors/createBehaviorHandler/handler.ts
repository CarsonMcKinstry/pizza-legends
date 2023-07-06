import {
  type Action,
  type UnknownAction,
  type Actions,
  type ActionCreatorForCaseHandler,
  type DetailedAction,
  createAction,
  AnyAction,
} from "./action";

export type Handler<S = any, A extends Action = UnknownAction> = (
  state: S,
  action: A
) => void;

export type CaseHandler<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type CaseHandlers<State, AS extends Actions> = {
  [T in keyof AS]: AS[T] extends Action ? CaseHandler<State, AS[T]> : void;
};

export interface BehaviorHandler<
  State = any,
  CaseHandlers extends BehaviorCaseHandlers<State> = BehaviorCaseHandlers<State>
> {
  run: Handler<State>;
  actions: BehaviorHandlerActions<CaseHandlers>;
}

export interface CreateBehaviorsOptions<
  State = any,
  CH extends BehaviorCaseHandlers<State> = BehaviorCaseHandlers<State>
> {
  exampleState: State;
  handlers: ValidateBehaviorCaseHandlers<State, CH>;
}

type BehaviorHandlerActions<CaseHandlers extends BehaviorCaseHandlers<any>> = {
  [Type in keyof CaseHandlers]: ActionCreatorForCaseHandler<
    CaseHandlers[Type],
    string
  >;
};

export type BehaviorCaseHandlers<State> = {
  [K: string]: CaseHandler<State, DetailedAction<any>>;
};

export type ValidateBehaviorCaseHandlers<
  S,
  ACR extends BehaviorCaseHandlers<S>
> = ACR & {
  [T in keyof ACR]: {};
};

export function createBehaviorHandler<
  State,
  CaseHandlers extends BehaviorCaseHandlers<State>
>(
  options: CreateBehaviorsOptions<State, CaseHandlers>
): BehaviorHandler<State, CaseHandlers> {
  const handlers = options.handlers || {};

  const handlerNames = Object.keys(handlers);

  const actionCreators = handlerNames.reduce<Record<string, Function>>(
    (prev, name) => {
      return {
        ...prev,
        [name]: createAction(name),
      };
    },
    {}
  );

  return {
    run: (state, action) => {
      for (const handlerName of handlerNames) {
        if (action.type === handlerName) {
          const handler = handlers[action.type];

          handler(state, action as DetailedAction<any>);
        }
      }
    },
    actions: actionCreators as any,
  };
}
