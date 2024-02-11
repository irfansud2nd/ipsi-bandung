import { getRegistered } from "@/utils/form/FormFunctions";
import {
  KontingenState,
  kontingenInitialValue,
} from "@/utils/form/kontingen/kontingenConstants";
import { compare } from "@/utils/shared/functions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: KontingenState[];
  registered: KontingenState[];
  unregistered: KontingenState[];
  toEdit: KontingenState;
};

const initialState: State = {
  all: [],
  registered: [],
  unregistered: [],
  toEdit: kontingenInitialValue,
};

const kontingensSlice = createSlice({
  name: "kontingens",
  initialState,
  reducers: {
    // SET KONTINGENS
    setKontingensRedux: (
      state,
      action: PayloadAction<{
        kontingens: KontingenState[];
        eventId?: string;
      }>
    ) => {
      const { kontingens, eventId } = action.payload;
      state.all = kontingens.sort(compare("namaKontingen", "asc"));

      getRegistered(state, kontingens, eventId);
    },
    // UPDATE KONTINGEN
    updateKontingenRedux: (
      state,
      action: PayloadAction<{
        kontingen: KontingenState;
        eventId?: string;
      }>
    ) => {
      const { kontingen, eventId } = action.payload;

      let newKontingens = [...state.all];
      newKontingens = newKontingens.filter((item) => item.id != kontingen.id);
      newKontingens.push(kontingen);
      state.all = newKontingens.sort(compare("namaKontingen", "asc"));

      getRegistered(state, newKontingens, eventId);
    },
    // ADD KONTINGEN
    addKontingenRedux: (
      state,
      action: PayloadAction<{
        kontingen: KontingenState;
        eventId?: string;
      }>
    ) => {
      const { kontingen, eventId } = action.payload;
      const kontingens = [...state.all, kontingen];
      state.all = kontingens.sort(compare("namaKontingen", "asc"));

      getRegistered(state, kontingens, eventId);
    },
    // DELETE KONTINGEN
    deleteKontingenRedux: (
      state,
      action: PayloadAction<{
        kontingen: KontingenState;
        eventId?: string;
      }>
    ) => {
      const { kontingen, eventId } = action.payload;
      const kontingens = [...state.all].filter(
        (item) => item.id != kontingen.id
      );
      state.all = kontingens.sort(compare("namaKontingen", "asc"));

      getRegistered(state, kontingens, eventId);
    },
    // SET KONTINGEN TO EDIT
    setKontingenToEditRedux: (state, action: PayloadAction<KontingenState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setKontingensRedux,
  updateKontingenRedux,
  addKontingenRedux,
  deleteKontingenRedux,
  setKontingenToEditRedux,
} = kontingensSlice.actions;
export default kontingensSlice.reducer;
