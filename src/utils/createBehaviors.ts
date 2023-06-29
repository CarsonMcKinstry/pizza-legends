type AnyObject = {
  // eslint-disable-next-line
  [key: string]: any;
};

type Behavior<D extends AnyObject, Type extends string = string> = {
  [Key in keyof D]: D[Key];
} & {
  type: Type;
};

export type BuildBehaviorType<B extends object> = ReturnType<B[keyof B]>;

function createBehavior<Data extends AnyObject, Type extends string = string>(
  type: Type
) {
  return (data: Data) => {
    return {
      ...data,
      type,
    } as Behavior<Data, Type>;
  };
}

export function createBehaviors<Behaviors extends AnyObject>(
  ...behaviors: (keyof Behaviors)[]
) {
  // eslint-disable-next-line
  const out: any = {};

  for (const behavior of behaviors) {
    out[behavior] = createBehavior(behavior as string);
  }

  return out as {
    [Key in keyof Behaviors]: ReturnType<
      typeof createBehavior<Behaviors[Key], Key extends string ? Key : never>
    >;
  };
}
