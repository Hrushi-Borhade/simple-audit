import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";


const rootReducer = combineReducers({
});

const store = configureStore({
  reducer: rootReducer
});

setupListeners(store.dispatch);

export type StoreRootStateType = ReturnType<typeof store.getState>;

export { store };
