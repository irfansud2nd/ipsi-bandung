import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/utils/redux/counter/counterSlice";
import userReducer from "@/utils/redux/user/userSlice";
import eventSorterReducer from "@/utils/redux/eventSorter/eventSorterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    eventSorter: eventSorterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
