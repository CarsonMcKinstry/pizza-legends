import { TILE_SIZE } from "./constants";

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
