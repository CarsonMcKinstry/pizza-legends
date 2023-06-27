import "./styles/global.css";
import { Overworld } from "./Overworld";

function main() {
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  overworld.init();
}

main();
