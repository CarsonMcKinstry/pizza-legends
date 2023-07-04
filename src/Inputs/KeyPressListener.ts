export class KeyPressListener {
  keyCode: string;
  callback: () => void;

  private keySafe = true;

  constructor(keyCode: string, callback: () => void) {
    this.keyCode = keyCode;
    this.callback = callback;

    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  private keydownFunction = (event: KeyboardEvent) => {
    if (event.code === this.keyCode && this.keySafe) {
      this.keySafe = false;
      this.callback();
    }
  };

  private keyupFunction = (event: KeyboardEvent) => {
    if (event.code === this.keyCode) {
      this.keySafe = true;
    }
  };

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}
