import "@/styles/main.css";
import { Game } from "@/Game";

async function main() {
  const game = new Game({
    element: document.querySelector(".game-container")!,
  });

  game.init();
}

main();
