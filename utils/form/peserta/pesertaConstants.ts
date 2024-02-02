import * as Yup from "yup";

// KATEGORI GENERATOR
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];

const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah?: { namaKelas: string; batasKelas?: number },
  bebasAtas?: { namaKelas: string; batasKelas?: number }
) => {
  const repeatValue = alphabet.indexOf(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebasBawah)
    kategoriArr.push(
      `Kelas ${bebasBawah.namaKelas} (Dibawah ${
        bebasBawah.batasKelas ? bebasBawah.batasKelas : start
      } KG)`
    );

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${alphabet[i]} (${startKategori}-${startKategori + step} KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebasAtas)
    kategoriArr.push(
      `Kelas ${bebasAtas.namaKelas} (Diatas ${
        bebasAtas.batasKelas ? bebasAtas.batasKelas : endNumber
      } KG)`
    );
  return kategoriArr;
};

// SENI TUNGGAL
const seniTunggal = {
  putra: ["Tunggal Putra"],
  putri: ["Tunggal Putri"],
};

// SENI LENGKAP
const seniLengkap = {
  putra: ["Tunggal Putra", "Ganda Putra", "Regu Putra"],
  putri: ["Tunggal Putri", "Ganda Putri", "Regu Putri"],
};

// TINGKATAN DAN KATEGORI
export const tingkatanKategori = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan(
      "O",
      26,
      2,
      {
        namaKelas: "<A",
      },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SMP",
    kategoriTanding: generateKategoriPertandingan("P", 30, 3, {
      namaKelas: "<A",
    }),
    kategoriSeni: seniLengkap,
  },
  {
    tingkatan: "SMA",
    kategoriTanding: generateKategoriPertandingan(
      "I",
      39,
      4,
      { namaKelas: "<39" },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniLengkap,
  },
  {
    tingkatan: "Dewasa",
    kategoriTanding: generateKategoriPertandingan(
      "J",
      45,
      5,
      { namaKelas: "<45" },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniLengkap,
  },
];

// JENIS PERTANDINGAN
export const jenisPertandingan = ["Tanding", "Seni"];

// JENIS KELAMIN PESERTA
export const jenisKelaminAtlet = ["Putra", "Putri"];

// PESERTA TYPE
export type PesertaState = {
  id: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  creatorEmail: string;
  namaLengkap: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  beratBadan: string;
  tinggiBadan: string;
  alamatLengkap: string;
  jenisKelamin: string;
  tingkatanPertandingan: string;
  jenisPertandingan: string;
  kategoriPertandingan: string;
  idKontingen: string;
  namaKontingen: string;
  fotoFile: File | undefined;
  downloadFotoUrl: string;
  fotoUrl: string;
  kkFile: File | undefined;
  kkUrl: string;
  downloadKkUrl: string;
  ktpFile: File | undefined;
  ktpUrl: string;
  downloadKtpUrl: string;
  email: string;
  noHp: string;
  pembayaran: boolean;
  idPembayaran: string;
  konfirmasi: boolean;
  idKonfirmasi: string;
};

// PESERTA INITIAL VALUE
export const pesertaInitialValue: PesertaState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  beratBadan: "",
  tinggiBadan: "",
  alamatLengkap: "",
  jenisKelamin: jenisKelaminAtlet[0],
  tingkatanPertandingan: tingkatanKategori[0].tingkatan,
  jenisPertandingan: jenisPertandingan[0],
  kategoriPertandingan: tingkatanKategori[0].kategoriTanding[0],
  idKontingen: "",
  namaKontingen: "",
  fotoFile: undefined,
  fotoUrl: "",
  downloadFotoUrl: "",
  kkFile: undefined,
  kkUrl: "",
  downloadKkUrl: "",
  ktpFile: undefined,
  ktpUrl: "",
  downloadKtpUrl: "",
  email: "",
  noHp: "",
  pembayaran: false,
  idPembayaran: "",
  konfirmasi: false,
  idKonfirmasi: "",
};

// PESERTA VALIDATION SCHEMA
export const pesertaValidationSchema = Yup.object({
  namaLengkap: Yup.string().required("Tolong lengkapi nama lengkap"),
  NIK: Yup.string()
    .matches(/[0-9]/g, "NIK tidak valid (mengandung huruf)")
    .min(16, "NIK tidak valid (< 16 digit)")
    .max(16, "NIK tidak valid (> 16 digit)")
    .required("Tolong lengkapi NIK"),
  tempatLahir: Yup.string().required("Tolong lengkapi tempat lahir"),
  tanggalLahir: Yup.string().required("Tolong lengkapi tanggal lahir"),
  beratBadan: Yup.string().required("Tolong lengkapi berat badan"),
  tinggiBadan: Yup.string().required("Tolong lengkapi tinggi badan"),
  // alamatLengkap: Yup.string().required("Tolong lengkapi alamat"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Tolong lengkapi email"),
  noHp: Yup.string().required("Tolong lengkapi email"),
  ktpFile: Yup.string().required("Tolong lengkapi file KTP"),
  kkFile: Yup.string().required("Tolong lengkapi file KK"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
});
