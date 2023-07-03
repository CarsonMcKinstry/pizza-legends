import clsx from "clsx";
import { Team } from "../../../types";

type PizzaProps = {
  src: string;
  active: boolean;
  team: Team;
  name: string;
};

export const Pizza = ({ src, active, team, name }: PizzaProps) => {
  return (
    <img
      className={clsx("Pizza", team, {
        active,
      })}
      src={src}
      alt={name}
    />
  );
};
