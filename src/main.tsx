import { Game } from "./Game";
import "./main.css";

async function main() {
  const game = new Game({
    element: document.querySelector(".game-container") as HTMLDivElement,
  });
  game.init();
}

main();
