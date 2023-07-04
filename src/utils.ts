import { TILE_SIZE } from "@/constants";
import { Direction } from "@/types";

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();

    image.addEventListener(
      "load",
      () => {
        res(image);
      },
      {
        once: true,
      }
    );

    image.addEventListener(
      "error",
      (err) => {
        rej(err);
      },
      {
        once: true,
      }
    );

    image.src = src;
  });

export const withGrid = (n: number) => n * TILE_SIZE;

export const nextPosition = (
  initialX: number,
  initialY: number,
  direction: Direction
) => {
  let x = initialX;
  let y = initialY;

  const size = TILE_SIZE;

  switch (direction) {
    case "left":
      x -= size;
      break;
    case "right":
      x += size;
      break;
    case "up":
      y -= size;
      break;
    case "down":
      y += size;
      break;
  }
  return { x, y };
};

export const asGridCoords = (x: number, y: number) =>
  `${x * TILE_SIZE},${y * TILE_SIZE}`;
