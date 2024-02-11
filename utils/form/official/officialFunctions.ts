import { collection, doc } from "firebase/firestore";
import { OfficialState } from "./officialConstants";
import { firestore } from "@/utils/firebase/firebase";
import axios from "axios";
import { Confirm, ResetForm, SetSubmitting } from "../FormConstants";
import { Id } from "react-toastify";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { controlToast, toastAxiosError } from "@/utils/shared/functions";
import {
  addOfficialRedux,
  deleteOfficialRedux,
  updateOfficialRedux,
} from "@/utils/redux/officials/officialsSlice";
import { sendFile } from "../FormFunctions";
import { KontingenState } from "../kontingen/kontingenConstants";
import { updateKontingenRedux } from "@/utils/redux/kontingens/kontingensSlice";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";

// SEND OFFICIAL
export const sendOfficial = (
  official: OfficialState,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  eventId?: string,
  registeredKontingen?: KontingenState
) => {
  if (!official.creatorEmail) {
    controlToast("Creator's email not found", toastId, "error", true);
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "officials"));
  const id = newDocRef.id;
  const fotoUrl = `officials/pasFoto/${id}`;
  let downloadFotoUrl = "";

  const stepController = (step: number) => {
    console.log("stepController", step);
    switch (step) {
      case 1:
        // SEND FOTO
        controlToast("Mengunggah pas foto", toastId, "loading", true);
        official.fotoFile &&
          sendFile(official.fotoFile, fotoUrl)
            .then((url) => {
              downloadFotoUrl = url;
              stepController(2);
            })
            .catch((error) => {
              setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        break;
      case 2:
        // ADD OFFICIAL TO KONTINGEN IF EVENT ID
        if (registeredKontingen && eventId) {
          controlToast("Menambahkan peserta ke kontingen", toastId, "loading");
          managePersonOnKontingen(
            registeredKontingen,
            "officials",
            id,
            "add",
            eventId
          )
            .then((kontingen) => {
              dispatch(updateKontingenRedux({ kontingen, eventId }));
              stepController(3);
            })
            .catch((error) => {
              console.log(error);
              setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        } else {
          stepController(3);
        }
        break;
      case 3:
        // SEND OFFICIAL
        controlToast("Menyimpan data", toastId, "loading");

        delete official.fotoFile;
        const data: OfficialState = {
          ...official,
          namaLengkap: official.namaLengkap.toUpperCase(),
          id,
          fotoUrl,
          downloadFotoUrl,
          waktuPendaftaran: Date.now(),
        };

        if (eventId) data.events = [...data.events, eventId];

        axios
          .post("/api/participant/officials", data)
          .then((res) => {
            controlToast("Official berhasil didaftarkan", toastId, "success");
            dispatch(addOfficialRedux({ official: data, eventId }));
          })
          .catch((error) => {
            setSubmitting(false);
            toastAxiosError(error, toastId);
          })
          .finally(() => resetForm());
        break;
    }
  };
  stepController(1);
};

// UPDATE OFFFICIAL
export const updateOfficial = (
  official: OfficialState,
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
        if (official.fotoFile) {
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
          .delete(`/api/file/${official.fotoUrl}`)
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
        official.fotoFile &&
          sendFile(official.fotoFile, official.fotoUrl)
            .then((url) => {
              official.downloadFotoUrl = url;
              stepController(2);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastAxiosError(error, toastId);
            });
        break;
      case 4:
        // UPDATE OFFICIAL
        resetForm &&
          controlToast("Menyimpan pembaharuan data", toastId, "loading");
        official.fotoFile && delete official.fotoFile;
        axios
          .patch("/api/participant/officials", official)
          .then((res) => {
            dispatch(updateOfficialRedux({ official, eventId }));
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

// DELETE OFFICIAL
export const deleteOfficial = (
  official: OfficialState,
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
        // DELETE FROM KONTINGEN
        withStatus &&
          controlToast(
            "Menghapus official dari kontingen",
            toastId,
            "loading",
            true
          );
        managePersonOnKontingen(
          kontingen,
          "officials",
          official.id,
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
          controlToast("Menghapus pas foto official", toastId, "loading");
        axios
          .delete(`/api/file/${official.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastAxiosError(error, toastId);
          });
        break;
      case 3:
        // DELETE OFFICIAL
        withStatus && controlToast("Menghapus official", toastId, "loading");
        axios
          .delete(`/api/officials/${official.creatorEmail}/${official.id}`)
          .then((res) => {
            withStatus &&
              controlToast("Official berhasil dihapus", toastId, "success");
            dispatch(deleteOfficialRedux({ official, eventId }));
            onComplete && onComplete();
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
    }
  };
};

// DELET OFFICIALS
export const deleteOfficials = (
  officials: OfficialState[],
  dispatch: Dispatch<UnknownAction>,
  toastId: React.MutableRefObject<Id | null>,
  kontingen: KontingenState,
  eventId?: string,
  onComplete?: () => void,
  newToast: boolean = false
) => {
  const deleteRepeater = (index: number) => {
    if (index >= officials.length) {
      onComplete && onComplete();
      return;
    }
    controlToast(
      `Menghapus official ${index + 1}/${officials.length}`,
      toastId,
      "loading",
      newToast
    );
    const official = officials[index];
    const repeat = () => deleteRepeater(index + 1);
    deleteOfficial(
      official,
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
