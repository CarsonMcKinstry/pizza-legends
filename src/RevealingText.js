export class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 70;

    this.timeout = null;
    this.isDone = false;
  }

  init() {
    let characters = [];

    this.text.split("").forEach((character) => {
      // create each span, add to the element in the DOM
      let span = document.createElement("span");
      span.textContent = character;

      this.element.appendChild(span);

      // Add thes apn to the internal state array.
      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed
      });
    });

    this.revealOneCharacter(characters);
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;

    this.element
      .querySelectorAll("span")
      .forEach((s) => s.classList.add("revealed"));
  }

  revealOneCharacter([next, ...rest]) {
    next.span.classList.add("revealed");

    if (rest.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(rest);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }
}
