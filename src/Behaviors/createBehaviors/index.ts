import {
  Action,
  ActionCreatorWithoutPayload,
  AnyAction,
  PayloadAction,
  PayloadActionCreator,
  UnknownAction,
  createAction,
} from "./action";

export interface Behaviors<
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

export type Actions<T extends keyof any = string> = Record<T, Action>;

export type Handler<S = any, A extends Action = UnknownAction> = (
  state: S,
  action: A
) => void | Promise<void>;

export type CaseReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type CaseHandlers<State, AS extends Actions> = {
  [T in keyof AS]: AS[T] extends Action ? CaseReducer<State, AS[T]> : void;
};

type BehaviorHandlerActions<CaseHandlers extends BehaviorCaseHandlers<any>> = {
  [Type in keyof CaseHandlers]: ActionCreatorForCaseReducer<
    CaseHandlers[Type],
    string
  >;
};

type ActionCreatorForCaseReducer<CH, Type extends string> = CH extends (
  state: any,
  action: infer Action
) => any
  ? Action extends { payload: infer P }
    ? PayloadActionCreator<P, Type>
    : ActionCreatorWithoutPayload<Type>
  : ActionCreatorWithoutPayload<Type>;

export type BehaviorCaseHandlers<State> = {
  [K: string]: CaseReducer<State, PayloadAction<any>>;
};

export type ValidateBehaviorCaseHandlers<
  S,
  ACR extends BehaviorCaseHandlers<S>
> = ACR & {
  [T in keyof ACR]: any;
};

export function createBehaviors<
  State,
  CaseHandlers extends BehaviorCaseHandlers<State>
>(
  options: CreateBehaviorsOptions<State, CaseHandlers>
): Behaviors<State, CaseHandlers> {
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
    run: async (state, action) => {
      for (const handlerName of handlerNames) {
        if (action.type === handlerName) {
          const reducer = handlers[action.type];

          await reducer(state, action as PayloadAction<any>);
        }
      }
    },
    actions: actionCreators as any,
  };
}
