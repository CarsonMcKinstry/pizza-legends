export type IsAny<T, True, False = never> = true | false extends (
  T extends never ? true : false
)
  ? True
  : False;

export type IsUnknown<T, True, False = never> = unknown extends T
  ? IsAny<T, False, True>
  : False;

export type IfMaybeUndefined<P, True, False> = [undefined] extends [P]
  ? True
  : False;

export type IfVoid<P, True, False> = [void] extends [P] ? True : False;
