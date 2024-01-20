import * as Yup from "yup";

// JENIS KELAMIN DEWASA
export const jenisKelaminDewasa = ["Pria", "Wanita"];

// JABATAN OFFICIAL
export const jabatanOfficials = ["Official", "Manajer Tim", "Pelatih"];

// OFFICIAL INITIAL VALUE
export const officialInitialValue: OfficialState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  jenisKelamin: jenisKelaminDewasa[0],
  jabatan: jabatanOfficials[0],
  idKontingen: "",
  fotoFile: undefined,
  fotoUrl: "",
  downloadFotoUrl: "",
};

// OFFICIAL TYPE
export type OfficialState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  jabatan: string;
  idKontingen: string;
  fotoFile: File | undefined;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// OFFICIAL VALIDATION SCHEMA
export const officialValidationSchema = Yup.object({
  namaLengkap: Yup.string().required("Tolong lengkapi nama lengkap"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
});
