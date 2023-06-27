export const withGrid = (n) => n * 16;

export const asGridCoords = (x, y) => `${x * 16},${y * 16}`;

export const nextPosition = (initialX, initialY, direction) => {
  let x = initialX;
  let y = initialY;

  const size = 16;

  if (direction === "left") {
    x -= size;
  } else if (direction === "right") {
    x += size;
  } else if (direction === "up") {
    y -= size;
  } else if (direction === "down") {
    y += size;
  }

  return { x, y };
};

export const emitEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  document.dispatchEvent(event);
};

export const oppositeDirection = (direction) => {
  return {
    up: "down",
    down: "up",
    left: "right",
    right: "left"
  }[direction];
};

export const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const randomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
