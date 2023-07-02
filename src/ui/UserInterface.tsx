import { Root } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { TextMessage } from "./components/TextMessage";

export class UserInterface {
  store: typeof store;
  dispatch: typeof store.dispatch;

  constructor() {
    this.store = store;
    this.dispatch = store.dispatch;
  }

  private render(root: Root) {
    root.render(
      <Provider store={this.store}>
        <TextMessage />
      </Provider>
    );
  }

  init(root: Root) {
    this.render(root);
  }
}
