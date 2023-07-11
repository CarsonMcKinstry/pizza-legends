import { IfMaybeUndefined, IfVoid, IsAny, IsUnknown } from "./tsHelpers";

export type DetailedAction<D = void, T extends string = string> = {
  details: D;
  type: T;
};

export type Actions<T extends keyof any = string> = Record<T, Action>;

export type Action<T extends string = string> = {
  type: T;
};

export interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

export type PayloadActionCreator<D = void, T extends string = string> = IsAny<
  D,
  ActionCreatorWithPayload<any, T>,
  // else
  IsUnknown<
    D,
    ActionCreatorWithNonInferrablePayload<T>,
    // else
    IfVoid<
      D,
      ActionCreatorWithoutPayload<T>,
      // else
      IfMaybeUndefined<
        D,
        ActionCreatorWithOptionalPayload<D, T>,
        // else
        ActionCreatorWithPayload<D, T>
      >
    >
  >
>;

export interface BaseActionCreator<D, T extends string> {
  type: T;
  match: (action: Action<any>) => action is DetailedAction<D, T>;
}

export interface ActionCreatorWithPayload<D, T extends string = string>
  extends BaseActionCreator<D, T> {
  (details: D): DetailedAction<D, T>;
}

export interface ActionCreatorWithNonInferrablePayload<
  T extends string = string
> extends BaseActionCreator<unknown, T> {
  <PT>(details: PT): DetailedAction<PT, T>;
}

export interface ActionCreatorWithoutPayload<T extends string = string>
  extends BaseActionCreator<undefined, T> {
  (noArgument: void): DetailedAction<undefined, T>;
}

export interface ActionCreatorWithOptionalPayload<D, T extends string = string>
  extends BaseActionCreator<D, T> {
  (details?: D): DetailedAction<D, T>;
}

export function createAction<D = void, T extends string = string>(
  type: T
): PayloadActionCreator<D, T> {
  function actionCreator(...args: any[]) {
    return {
      type,
      details: args[0],
    };
  }

  actionCreator.toString = () => `${type}`;
  actionCreator.type = type;
  actionCreator.match = (action: Action<any>): action is DetailedAction =>
    action.type === type;

  return actionCreator as PayloadActionCreator<D, T>;
}

export type ActionCreatorForCaseHandler<CH, Type extends string> = CH extends (
  state: any,
  action: infer Action
) => any
  ? Action extends { details: infer D }
    ? PayloadActionCreator<D, Type>
    : ActionCreatorWithoutPayload<Type>
  : ActionCreatorWithoutPayload<Type>;
