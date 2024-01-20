import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type EventSorterState = {
  value: string;
};

const initialState: EventSorterState = {
  value: "latest",
};

const eventSorterSlice = createSlice({
  name: "eventSorter",
  initialState,
  reducers: {
    change: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { change } = eventSorterSlice.actions;
export default eventSorterSlice.reducer;
