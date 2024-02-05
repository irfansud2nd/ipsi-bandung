import { jenisKelaminAtlet } from "../peserta/pesertaConstants";

// PAL TYPE
export type PalState = {
  email: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  verified: boolean;
  [key: string]: any;
};

// PAL INITIAL VALUE
export const PalInitialValue: PalState = {
  email: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  jenisKelamin: jenisKelaminAtlet[0],
  verified: false,
};
