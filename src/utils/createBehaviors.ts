type AnyObject = {
  // eslint-disable-next-line
  [key: string]: any;
};

export type Behavior<Type extends string, D extends AnyObject> = {
  [Key in keyof D]: D[Key];
} & {
  type: Type;
};

export type BehaviorCreator<Type extends string, Data extends AnyObject> = (
  data: Data
) => Behavior<Type, Data>;

export type BuildBehaviorType<B extends object> = ReturnType<B[keyof B]>;

function createBehavior<Data extends AnyObject, Type extends string = string>(
  type: Type
) {
  return (data: Data) => {
    return {
      ...data,
      type,
    } as Behavior<Type, Data>;
  };
}

export function createBehaviors<Behaviors extends AnyObject>(
  ...behaviors: (keyof Behaviors)[]
) {
  // eslint-disable-next-line
  const bahviorCreator: any = {};

  for (const behavior of behaviors) {
    bahviorCreator[behavior] = createBehavior(behavior as string);
  }

  return bahviorCreator as {
    [Key in keyof Behaviors]: BehaviorCreator<
      Key extends string ? Key : never,
      Behaviors[Key]
    >;
  };
}
