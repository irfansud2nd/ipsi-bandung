import { arrayUnion, collection, doc } from "firebase/firestore";
import {
  PesertaState,
  jenisKelaminAtlet,
  jenisPertandingan,
  tingkatanKategori,
} from "./pesertaConstants";
import { firestore } from "@/utils/firebase/firebase";
import { ResetForm, SetSubmitting } from "../FormConstants";
import { Id } from "react-toastify";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosFileConfig } from "@/utils/shared/constants";
import { controlToast, toastAxiosError } from "@/utils/shared/functions";
import {
  addPesertaRedux,
  deletePesertaRedux,
  updatePesertaRedux,
} from "@/utils/redux/pesertas/pesertasSlice";
import { KontingenState } from "../kontingen/kontingenConstants";
import { updateKontingenRedux } from "@/utils/redux/kontingens/kontingensSlice";
import { sendFile } from "../FormFunctions";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";

// CALCULATE AGE
export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

// SEND NEW PESERTA
export const sendPeserta = (
  peserta: PesertaState,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  eventId?: string,
  registeredKontingen?: KontingenState
) => {
  if (!peserta.creatorEmail) {
    controlToast("Creator's email not found", toastId, "error", true);
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "pesertas"));
  const id = newDocRef.id;
  const fotoUrl = `pesertas/pasFoto/${id}`;
  const kkUrl = `pesertas/kk/${id}`;
  const ktpUrl = `pesertas/ktp/${id}`;
  let downloadFotoUrl = "";
  let downloadKtpUrl = "";
  let downloadKkUrl = "";
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        controlToast("Mengunggah pas foto", toastId, "loading", true);
        const pasFoto = new FormData();
        peserta.fotoFile && pasFoto.append("file", peserta.fotoFile);
        pasFoto.append("directory", fotoUrl);
        axios
          .post("/api/file", pasFoto, axiosFileConfig)
          .then((res) => {
            downloadFotoUrl = res.data.downloadUrl;
            stepController(2);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 2:
        // SEND KTP
        controlToast("Mengunggah KTP", toastId, "loading");
        const ktp = new FormData();
        peserta.ktpFile && ktp.append("file", peserta.ktpFile);
        ktp.append("directory", ktpUrl);
        axios
          .post("/api/file", ktp, axiosFileConfig)
          .then((res) => {
            downloadKtpUrl = res.data.downloadUrl;
            stepController(3);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 3:
        // SEND KK
        controlToast("Mengunggah kartu keluarga", toastId, "loading");
        const kk = new FormData();
        peserta.kkFile && kk.append("file", peserta.kkUrl);
        kk.append("directory", kkUrl);
        axios
          .post("/api/file", kk, axiosFileConfig)
          .then((res) => {
            downloadKkUrl = res.data.downloadUrl;
            stepController(4);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 4:
        // ADD PESERTA TO KONTINGEN
        if (registeredKontingen && eventId) {
          controlToast("Menambahkan peserta ke kontingen", toastId, "loading");
          managePersonOnKontingen(
            registeredKontingen,
            "pesertas",
            id,
            "add",
            eventId
          )
            .then((kontingen) => {
              dispatch(updateKontingenRedux({ kontingen, eventId }));
              stepController(5);
            })
            .catch((error) => toastAxiosError(error, toastId));
        } else {
          stepController(5);
        }
        break;
      case 5:
        // SEND PESERTA
        controlToast("Menyimpan data", toastId, "loading");
        delete peserta.fotoFile;
        delete peserta.kkFile;
        delete peserta.ktpFile;
        const dataPeserta: PesertaState = {
          ...peserta,
          namaLengkap: peserta.namaLengkap.toUpperCase(),
          id,
          fotoUrl,
          downloadFotoUrl,
          ktpUrl,
          downloadKtpUrl,
          kkUrl,
          downloadKkUrl,
          waktuPendaftaran: Date.now(),
        };

        if (eventId) dataPeserta.events = [...dataPeserta.events, eventId];

        axios
          .post("/api/participant/pesertas", dataPeserta)
          .then((res) => {
            controlToast("Peserta berhasil didaftarkan", toastId, "success");
            dispatch(addPesertaRedux({ peserta: dataPeserta, eventId }));
          })
          .catch((error) => toastAxiosError(error, toastId))
          .finally(() => resetForm());
        break;
    }
  };
  stepController(1);
};

// SELECT DEFAULT CATEGORY
export const selectCategory = (
  tingkatan: string,
  pertandingan: string,
  jenisKelamin: string
) => {
  if (pertandingan == jenisPertandingan[0]) {
    return tingkatanKategori[
      tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
    ].kategoriTanding;
  } else {
    if (jenisKelamin == jenisKelaminAtlet[0]) {
      return tingkatanKategori[
        tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriSeni.putra;
    } else {
      return tingkatanKategori[
        tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriSeni.putri;
    }
  }
};

// UPDATE PESERTA
export const updatePeserta = (
  peserta: PesertaState,
  dispatch: Dispatch<UnknownAction>,
  toastId: React.MutableRefObject<Id | null>,
  eventId?: string,
  onComplete?: () => void,
  resetForm?: ResetForm,
  setSubmitting?: SetSubmitting
) => {
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF PAS FOTO CHANGED
        if (peserta.fotoFile) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE OLD PAS FOTO
        resetForm &&
          controlToast("Menghapus pas foto lama", toastId, "loading", true);
        axios
          .delete(`/api/file/${peserta.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastAxiosError(error, toastId);
          });
        break;
      case 3:
        // UPLOAD NEW PAS FOTO
        resetForm &&
          controlToast("Mengunggah pas foto baru", toastId, "loading");
        peserta.fotoFile &&
          sendFile(peserta.fotoFile, peserta.fotoUrl)
            .then((url) => {
              peserta.downloadFotoUrl = url;
              stepController(4);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        break;
      case 4:
        // CHECK IF KTP CHANGED
        if (peserta.ktpFile) {
          stepController(5);
        } else {
          stepController(7);
        }
        break;
      case 5:
        // DELETE OLD KTP
        resetForm &&
          controlToast(
            "Menghapus KTP lama",
            toastId,
            "loading",
            !peserta.fotoFile
          );
        axios
          .delete(`/api/file/${peserta.ktpUrl}`)
          .then(() => stepController(6))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastAxiosError(error, toastId);
          });
        break;
      case 6:
        // UPLOAD NEW KTP
        resetForm && controlToast("Mengunggah KTP baru", toastId, "loading");
        peserta.ktpFile &&
          sendFile(peserta.ktpFile, peserta.ktpUrl)
            .then((url) => {
              peserta.downloadKtpUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        break;
      case 7:
        // CHECK IF KK CHANGED
        if (peserta.kkFile) {
          stepController(8);
        } else {
          stepController(10);
        }
        break;
      case 8:
        // DELETE OLD KK
        resetForm &&
          controlToast(
            "Menghapus KK lama",
            toastId,
            "loading",
            !peserta.ktpFile
          );
        axios
          .delete(`/api/file/${peserta.kkUrl}`)
          .then(() => stepController(9))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastAxiosError(error, toastId);
          });
        break;
      case 9:
        // UPLOAD NEW KK
        resetForm && controlToast("Mengunggah KK baru", toastId, "loading");
        peserta.kkFile &&
          sendFile(peserta.kkFile, peserta.kkUrl)
            .then((url) => {
              peserta.downloadKkUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        break;
      case 10:
        // UPDATE PESERTA
        resetForm &&
          controlToast("Menyimpan pembaharuan data", toastId, "loading");
        peserta.fotoFile && delete peserta.fotoFile;
        peserta.ktpFile && delete peserta.ktpFile;
        peserta.kkFile && delete peserta.kkFile;

        axios
          .patch("/api/participant/pesertas", peserta)
          .then((res) => {
            dispatch(updatePesertaRedux({ peserta, eventId }));
            resetForm &&
              controlToast(
                "Pembaharuan data berhasil didaftarkan",
                toastId,
                "success"
              );
            onComplete && onComplete();
            resetForm && resetForm();
          })
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastAxiosError(error, toastId);
          });
        break;
    }
  };
  stepController(1);
};

// DELETE PESERTA
export const deletePeserta = (
  peserta: PesertaState,
  dispatch: Dispatch<UnknownAction>,
  toastId: React.MutableRefObject<Id | null>,
  kontingen: KontingenState,
  withStatus: boolean = true,
  eventId?: string,
  onComplete?: () => void
) => {
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE PESERTA FROM KONTINGEN
        withStatus &&
          controlToast(
            "Menghapus peserta dari kontingen",
            toastId,
            "loading",
            true
          );
        managePersonOnKontingen(
          kontingen,
          "pesertas",
          peserta.id,
          "delete",
          eventId
        )
          .then((kontingen) => {
            dispatch(updateKontingenRedux({ kontingen, eventId }));
            stepController(2);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 2:
        // DELETE PAS FOTO
        withStatus &&
          controlToast("Menghapus pas foto peserta", toastId, "loading");
        axios
          .delete(`/api/file/${peserta.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastAxiosError(error, toastId);
          });
        break;
      case 3:
        // DELETE KTP
        withStatus && controlToast("Menghapus ktp peserta", toastId, "loading");
        axios
          .delete(`/api/file/${peserta.ktpUrl}`)
          .then(() => stepController(4))
          .catch((error) => {
            toastAxiosError(error, toastId);
          });
        break;
      case 4:
        // DELETE KK
        withStatus && controlToast("Menghapus kk peserta", toastId, "loading");
        axios
          .delete(`/api/file/${peserta.kkUrl}`)
          .then(() => stepController(5))
          .catch((error) => {
            toastAxiosError(error, toastId);
          });
        break;
      case 5:
        // DELETE PESERTA
        withStatus && controlToast("Menghapus peserta", toastId, "loading");
        axios
          .delete(`/api/pesertas/${peserta.creatorEmail}/${peserta.id}`)
          .then((res) => {
            withStatus &&
              controlToast("Peserta berhasil dihapus", toastId, "success");
            dispatch(deletePesertaRedux({ peserta, eventId }));
            onComplete && onComplete();
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
    }
  };
  stepController(1);
};

// DELETE PESERTAS
export const deletePesertas = (
  pesertas: PesertaState[],
  dispatch: Dispatch<UnknownAction>,
  toastId: React.MutableRefObject<Id | null>,
  kontingen: KontingenState,
  eventId?: string,
  onComplete?: () => void,
  newToast: boolean = false
) => {
  const deleteRepeater = (index: number) => {
    if (index >= pesertas.length) {
      onComplete && onComplete();
      return;
    }
    controlToast(
      `Menghapus peserta ${index + 1}/${pesertas.length}`,
      toastId,
      "loading",
      newToast
    );
    const peserta = pesertas[index];
    const repeat = () => deleteRepeater(index + 1);
    deletePeserta(
      peserta,
      dispatch,
      toastId,
      kontingen,
      false,
      eventId,
      repeat
    );
  };
  deleteRepeater(0);
};
