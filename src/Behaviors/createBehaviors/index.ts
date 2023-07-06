import {
  type ActionCreatorForCaseHandler,
  type PayloadAction,
  createAction,
} from "./action";
import type { CaseHandler, Handler } from "./handler";

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

type BehaviorHandlerActions<CaseHandlers extends BehaviorCaseHandlers<any>> = {
  [Type in keyof CaseHandlers]: ActionCreatorForCaseHandler<
    CaseHandlers[Type],
    string
  >;
};

export type BehaviorCaseHandlers<State> = {
  [K: string]: CaseHandler<State, PayloadAction<any>>;
};

export type ValidateBehaviorCaseHandlers<
  S,
  ACR extends BehaviorCaseHandlers<S>
> = ACR & {
  [T in keyof ACR]: {};
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
    run: (state, action) => {
      for (const handlerName of handlerNames) {
        if (action.type === handlerName) {
          const handler = handlers[action.type];

          handler(state, action as PayloadAction<any>);
        }
      }
    },
    actions: actionCreators as any,
  };
}

const b = createBehaviors({
  exampleState: {} as { direction: string },
  handlers: {
    walk(state) {},
  },
});
