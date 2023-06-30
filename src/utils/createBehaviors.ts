type WhoObject = {
  // eslint-disable-next-line
  [key: string]: any;
  who?: string;
};

export type Behavior<Type extends string, D extends WhoObject> = {
  [Key in keyof D]: D[Key];
} & {
  type: Type;
};

export type BehaviorCreator<Type extends string, Data extends WhoObject> = (
  data: Data
) => Behavior<Type, Data>;

export type BuildBehaviorType<B extends object> = ReturnType<B[keyof B]>;

function createBehavior<Data extends WhoObject, Type extends string = string>(
  type: Type
) {
  return (data: Data) => {
    return {
      ...data,
      type,
    } as Behavior<Type, Data>;
  };
}

export function createBehaviors<Behaviors extends WhoObject & { who?: string }>(
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
