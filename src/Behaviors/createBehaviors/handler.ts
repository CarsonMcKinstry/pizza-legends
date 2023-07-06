import { AnyAction } from "@reduxjs/toolkit";
import { Action, UnknownAction, Actions } from "./action";

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
