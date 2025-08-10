import { createStore, combineReducers } from "redux";
import { userCountReducer } from "./userCountReducer";

const rootReducer = combineReducers({
  userCount: userCountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);
