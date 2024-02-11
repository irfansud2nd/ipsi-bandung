import { getRegistered } from "@/utils/form/FormFunctions";
import {
  PesertaState,
  pesertaInitialValue,
} from "@/utils/form/peserta/pesertaConstants";
import { compare } from "@/utils/shared/functions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: PesertaState[];
  registered: PesertaState[];
  unregistered: PesertaState[];
  toEdit: PesertaState;
};

const initialState: State = {
  all: [],
  registered: [],
  unregistered: [],
  toEdit: pesertaInitialValue,
};

const pesertasSlice = createSlice({
  name: "pesertas",
  initialState,
  reducers: {
    // SET PESERTA
    setPesertasRedux: (
      state,
      action: PayloadAction<{
        pesertas: PesertaState[];
        eventId?: string;
      }>
    ) => {
      const { pesertas, eventId } = action.payload;
      state.all = pesertas.sort(compare("namaLengkap", "asc"));

      getRegistered(state, pesertas, eventId);
    },
    // UPDATE PESERTA
    updatePesertaRedux: (
      state,
      action: PayloadAction<{
        peserta: PesertaState;
        eventId?: string;
      }>
    ) => {
      const { peserta, eventId } = action.payload;

      let newPesertas = [...state.all];
      newPesertas = newPesertas.filter((item) => item.id != peserta.id);
      newPesertas.push(peserta);
      state.all = newPesertas.sort(compare("namaLengkap", "asc"));

      getRegistered(state, newPesertas, eventId);
    },
    // ADD PESERTA
    addPesertaRedux: (
      state,
      action: PayloadAction<{
        peserta: PesertaState;
        eventId?: string;
      }>
    ) => {
      const { peserta, eventId } = action.payload;
      const pesertas = [...state.all, peserta];
      state.all = pesertas.sort(compare("namaLengkap", "asc"));

      getRegistered(state, pesertas, eventId);
    },
    // DELETE PESERTA
    deletePesertaRedux: (
      state,
      action: PayloadAction<{
        peserta: PesertaState;
        eventId?: string;
      }>
    ) => {
      const { peserta, eventId } = action.payload;
      const pesertas = [...state.all].filter((item) => item.id != peserta.id);
      state.all = pesertas.sort(compare("namaLengkap", "asc"));

      getRegistered(state, pesertas, eventId);
    },
    // SET PESERTA TO EDIT
    setPesertaToEditRedux: (state, action: PayloadAction<PesertaState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setPesertasRedux,
  updatePesertaRedux,
  addPesertaRedux,
  deletePesertaRedux,
  setPesertaToEditRedux,
} = pesertasSlice.actions;
export default pesertasSlice.reducer;
