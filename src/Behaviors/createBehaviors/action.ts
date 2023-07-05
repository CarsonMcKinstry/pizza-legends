import { IfMaybeUndefined, IfVoid, IsAny, IsUnknown } from "./tsHelpers";

export type PayloadAction<P = void, T extends string = string> = {
  payload: P;
  type: T;
};

export type Action<T extends string = string> = {
  type: T;
};

export interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

export type PayloadActionCreator<P = void, T extends string = string> = IsAny<
  P,
  ActionCreatorWithPayload<any, T>,
  // else
  IsUnknown<
    P,
    ActionCreatorWithNonInferrablePayload<T>,
    // else
    IfVoid<
      P,
      ActionCreatorWithoutPayload<T>,
      // else
      IfMaybeUndefined<
        P,
        ActionCreatorWithOptionalPayload<P, T>,
        // else
        ActionCreatorWithPayload<P, T>
      >
    >
  >
>;

export interface BaseActionCreator<P, T extends string> {
  type: T;
  match: (action: Action<any>) => action is PayloadAction<P, T>;
}

export interface ActionCreatorWithPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  (payload: P): PayloadAction<P, T>;
}

export interface ActionCreatorWithNonInferrablePayload<
  T extends string = string
> extends BaseActionCreator<unknown, T> {
  <PT>(payload: PT): PayloadAction<PageTransitionEvent, T>;
}

export interface ActionCreatorWithoutPayload<T extends string = string>
  extends BaseActionCreator<undefined, T> {
  (noArgument: void): PayloadAction<undefined, T>;
}

export interface ActionCreatorWithOptionalPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  (payload?: P): PayloadAction<P, T>;
}

export function createAction<P = void, T extends string = string>(
  type: T
): PayloadActionCreator<P, T> {
  function actionCreator(...args: any[]) {
    return {
      type,
      payload: args[0],
    };
  }

  actionCreator.toString = () => `${type}`;
  actionCreator.type = type;
  actionCreator.match = (action: Action<any>): action is PayloadAction =>
    action.type === type;

  return actionCreator as PayloadActionCreator<P, T>;
}
