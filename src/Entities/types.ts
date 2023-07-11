import { Entity } from "@/Entity";
import { Character } from "./Character";
import { PizzaStone } from "./PizzaStone";
import { SceneEntityConfig } from "@/Scenes/types";

export enum EntityType {
  Character,
  PizzaStone,
}

export const EntityMap: Record<EntityType, typeof Entity<any>> = {
  [EntityType.Character]: Character,
  [EntityType.PizzaStone]: PizzaStone,
};

export const fromEntityConfig = (
  type: EntityType,
  config: SceneEntityConfig
) => {
  const Constructor = EntityMap[type];

  return new Constructor(config);
};
