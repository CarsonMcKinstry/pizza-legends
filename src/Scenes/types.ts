import { CharacterConfig } from "@/Entities/Character";
import { PizzaStoneConfig } from "@/Entities/PizzaStone";
import { TriggerSpaces } from "@/types";

export type SceneEntityConfig = CharacterConfig | PizzaStoneConfig;

export type SceneConfig = {
  id: string;
  entityConfigs: Record<string, SceneEntityConfig>;
  backgroundSrc: string;
  foregroundSrc: string;
  walls?: Record<string, true>;
  triggerSpaces: TriggerSpaces;
};
