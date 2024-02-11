import { getRegistered } from "@/utils/form/FormFunctions";
import {
  OfficialState,
  officialInitialValue,
} from "@/utils/form/official/officialConstants";
import { compare } from "@/utils/shared/functions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: OfficialState[];
  registered: OfficialState[];
  unregistered: OfficialState[];
  toEdit: OfficialState;
};

const initialState: State = {
  all: [],
  registered: [],
  unregistered: [],
  toEdit: officialInitialValue,
};

const officialsSlice = createSlice({
  name: "officials",
  initialState,
  reducers: {
    // SET OFFFICIAL
    setOfficialsRedux: (
      state,
      action: PayloadAction<{
        officials: OfficialState[];
        eventId?: string;
      }>
    ) => {
      const { officials, eventId } = action.payload;
      state.all = officials.sort(compare("namaLengkap", "asc"));

      getRegistered(state, officials, eventId);
    },
    // UPDATE OFFICIAL
    updateOfficialRedux: (
      state,
      action: PayloadAction<{
        official: OfficialState;
        eventId?: string;
      }>
    ) => {
      const { official, eventId } = action.payload;

      let newOfficials = [...state.all];
      newOfficials = newOfficials.filter((item) => item.id != official.id);
      newOfficials.push(official);
      state.all = newOfficials.sort(compare("namaLengkap", "asc"));

      getRegistered(state, newOfficials, eventId);
    },
    // ADD OFFICIAL
    addOfficialRedux: (
      state,
      action: PayloadAction<{
        official: OfficialState;
        eventId?: string;
      }>
    ) => {
      const { official, eventId } = action.payload;
      const officials = [...state.all, official];
      state.all = officials.sort(compare("namaLengkap", "asc"));

      getRegistered(state, officials, eventId);
    },
    // DELETE OFFICIAL
    deleteOfficialRedux: (
      state,
      action: PayloadAction<{
        official: OfficialState;
        eventId?: string;
      }>
    ) => {
      const { official, eventId } = action.payload;
      const officials = [...state.all].filter((item) => item.id != official.id);
      state.all = officials.sort(compare("namaLengkap", "asc"));

      getRegistered(state, officials, eventId);
    },
    // SET OFFICIAL TO EDIT
    setOfficialToEditRedux: (state, action: PayloadAction<OfficialState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setOfficialsRedux,
  updateOfficialRedux,
  addOfficialRedux,
  deleteOfficialRedux,
  setOfficialToEditRedux,
} = officialsSlice.actions;
export default officialsSlice.reducer;
