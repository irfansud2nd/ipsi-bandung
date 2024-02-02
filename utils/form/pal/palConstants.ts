import { jenisKelaminAtlet } from "../peserta/pesertaConstants";

// PAL TYPE
export type PalState = {
  id: string;
  email: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  verified: boolean;
};

// PAL INITIAL VALUE
export const PalInitialValue: PalState = {
  id: "",
  email: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  jenisKelamin: jenisKelaminAtlet[0],
  verified: false,
};
