import "@/styles/Pizza.css";
import { Team } from "@/Battle/Battle";
import clsx from "clsx";

type PizzaProps = { src: string; name: string; team: Team };

export const Pizza = ({ src, name, team }: PizzaProps) => {
  return <img className={clsx("Pizza", team)} src={src} alt={name} />;
};
