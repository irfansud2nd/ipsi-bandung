import * as Yup from "yup";

// KONTINGEN STATE
export const kontingenInitialValue: KontingenState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaKontingen: "",
  pesertas: [],
  officials: [],
  idPembayaran: [],
  unconfirmedPembayaran: [],
  confirmedPembayaran: [],
  infoPembayaran: [],
  infoKonfirmasi: [],
};

// KONTINGEN STATE
export type KontingenState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaKontingen: string;
  pesertas: string[] | [];
  officials: string[] | [];
  idPembayaran: string[];
  unconfirmedPembayaran: string[];
  confirmedPembayaran: string[];
  infoPembayaran: {
    idPembayaran: string;
    nominal: string;
    noHp: string;
    waktu: string;
    buktiUrl: string;
  }[];
  infoKonfirmasi: {
    idPembayaran: string;
    nama: string;
    email: string;
    waktu: string;
  }[];
};

export const kontingenValidationSchema = Yup.object({
  namaKontingen: Yup.string().required("Tolong lengkapi nama kontingen"),
});
