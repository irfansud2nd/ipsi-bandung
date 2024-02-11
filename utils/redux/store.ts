import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/utils/redux/counter/counterSlice";
import userReducer from "@/utils/redux/user/userSlice";
import eventSorterReducer from "@/utils/redux/eventSorter/eventSorterSlice";
import kontingensReducer from "@/utils/redux/kontingens/kontingensSlice";
import officialsReducer from "@/utils/redux/officials/officialsSlice";
import pesertasReducer from "@/utils/redux/pesertas/pesertasSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    eventSorter: eventSorterReducer,
    kontingens: kontingensReducer,
    officials: officialsReducer,
    pesertas: pesertasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
