import { configureStore } from "@reduxjs/toolkit";
import phaseReducer from "./phaseSlice";
import taskReducer from "./taskSlice";
import weddingEventReducer from "./weddingEventSlice";
export const store = configureStore({
  reducer: {
    phases: phaseReducer,
    tasks: taskReducer,
    weddingEvent: weddingEventReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;