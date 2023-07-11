import { playerState } from "./State/PlayerState";
import { Direction } from "./types";

export class Progress {
  mapId = "Kitchen";
  startingHeroX = 0;
  startingHeroY = 0;
  startingHeroDirection: Direction = "down";
  saveFileKey = "PizzaLegends_SaveFile1";

  constructor() {}

  save() {
    localStorage.setItem(
      this.saveFileKey,
      JSON.stringify({
        mapId: this.mapId,
        startingHeroX: this.startingHeroX,
        startingHeroY: this.startingHeroY,
        startingHeroDirection: this.startingHeroDirection,
        playerState: {
          pizzas: playerState.pizzas,
          lineup: playerState.lineup,
          items: playerState.items,
          storyFlags: playerState.storyFlags,
        },
      })
    );
  }

  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;

      playerState.pizzas = file.playerState.pizzas;
      playerState.lineup = file.playerState.lineup;
      playerState.items = file.playerState.items;
      playerState.storyFlags = file.playerState.storyFlags;
    }
  }

  getSaveFile() {
    const file = localStorage.getItem(this.saveFileKey);

    return file ? JSON.parse(file) : null;
  }
}
