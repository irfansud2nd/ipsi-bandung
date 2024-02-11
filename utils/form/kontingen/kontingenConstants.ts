import { FormikState } from "formik";
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
  events: [],
  totalPembayaran: 0,
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
  totalPembayaran: number;
  events: string[];
  [key: string]: any;
};

// KONTINGEN VALIDATION SCHEMA
export const kontingenValidationSchema = Yup.object({
  namaKontingen: Yup.string().required("Tolong lengkapi nama kontingen"),
});
