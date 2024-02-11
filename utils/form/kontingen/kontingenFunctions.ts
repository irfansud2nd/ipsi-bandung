import { collection, doc } from "firebase/firestore";
import { KontingenState } from "./kontingenConstants";
import { firestore } from "@/utils/firebase/firebase";
import { Confirm, ResetForm, SetSubmitting } from "../FormConstants";
import { controlToast, toastAxiosError } from "@/utils/shared/functions";
import axios from "axios";
import { Id } from "react-toastify";
import {
  addKontingenRedux,
  deleteKontingenRedux,
  updateKontingenRedux,
} from "@/utils/redux/kontingens/kontingensSlice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { OfficialState } from "../official/officialConstants";
import { PesertaState } from "../peserta/pesertaConstants";
import { updatePersons } from "../FormFunctions";
import { deleteOfficials } from "../official/officialFunctions";
import { deletePesertas } from "../peserta/pesertaFunctions";

// SEND NEW KONTINGEN
export const sendKontingen = (
  kontingen: KontingenState,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  eventId: string
) => {
  if (!kontingen.creatorEmail) {
    controlToast("Creator's email not found", toastId, "error", true);
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "kontingens"));
  const id = newDocRef.id;

  const data: KontingenState = {
    ...kontingen,
    namaKontingen: kontingen.namaKontingen.toUpperCase(),
    id,
    waktuPendaftaran: Date.now(),
  };

  if (eventId) data.events = [...data.events, eventId];

  controlToast("Mendaftarkan kontingen baru", toastId, "loading", true);
  axios
    .post("/api/participant/kontingens", data)
    .then((res) => {
      controlToast("Kontingen baru berhasil didaftarkan", toastId, "success");
      dispatch(addKontingenRedux({ kontingen: data, eventId }));
    })
    .catch((error) => toastAxiosError(error, toastId))
    .finally(() => resetForm());
};

// UPDATE KONTINGEN
export const updateKontingen = async (
  newKontingen: KontingenState,
  oldKontingen: KontingenState,
  kontingenOfficials: OfficialState[],
  kontingenPesertas: PesertaState[],
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
        // CHECK IF NAME CHANGED
        if (oldKontingen.namaKontingen != newKontingen.namaKontingen) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // CHANGE OFFICIAL.NAMAKONTINGEN
        updatePersons(
          kontingenOfficials,
          "official",
          (data) => ({ ...data, namaKontingen: newKontingen.namaKontingen }),
          toastId,
          dispatch,
          () => stepController(3),
          eventId
        );
        break;
      case 3:
        // CHANGE PESERTA.NAMAKONTINGEN
        updatePersons(
          kontingenPesertas,
          "peserta",
          (data) => ({ ...data, namaKontingen: newKontingen.namaKontingen }),
          toastId,
          dispatch,
          () => stepController(4),
          eventId
        );
        break;
      case 4:
        // UPDATE KONTINGEN
        controlToast(
          "Menyimpan perubahan kontingen",
          toastId,
          "loading",
          oldKontingen.namaKontingen == newKontingen.namaKontingen
        );
        const data = {
          ...newKontingen,
          namaKontingen: newKontingen.namaKontingen.toUpperCase(),
        };
        axios
          .patch("/api/participant/kontingens", data)
          .then((res) => {
            controlToast(
              "Perubahan kontingen berhasil disimpan",
              toastId,
              "success"
            );
            dispatch(updateKontingenRedux({ kontingen: data, eventId }));
            onComplete && onComplete();
            resetForm && resetForm();
            setSubmitting && setSubmitting(false);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
    }
  };
  stepController(1);
};

// DELETE PERSON TO KONTINGEN
export const managePersonOnKontingen = async (
  kontingen: KontingenState,
  tipe: "officials" | "pesertas",
  personId: string,
  action: "add" | "delete",
  eventId?: string,
  eventOnly: boolean = false
) => {
  let data: KontingenState = { ...kontingen };

  if (!eventOnly) {
    data =
      action == "add"
        ? { ...data, [tipe]: [...data[tipe], personId] }
        : {
            ...data,
            [tipe]: [...data[tipe]].filter((item) => item != personId),
          };
  }

  if (eventId) {
    if (action == "add") {
      data = [...data[`${eventId}-${tipe}`]]
        ? {
            ...data,
            [`${eventId}-${tipe}`]: [...data[`${eventId}-${tipe}`], personId],
          }
        : {
            ...data,
            [`${eventId}-${tipe}`]: [personId],
          };
    } else if ([...data[`${eventId}-${tipe}`]]) {
      data = {
        ...data,
        [`${eventId}-${tipe}`]: [...data[`${eventId}-${tipe}`]].filter(
          (item) => item != personId
        ),
      };
    }
  }

  return axios
    .patch("/api/participant/kontingens", data)
    .then((res) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

// ADD KONTIGNEN TO EVENT
export const addKontingenToEvent = async (
  kontingen: KontingenState,
  confirm: Confirm,
  kontingenOfficials: OfficialState[],
  kontingenPesertas: PesertaState[],
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  eventId: string,
  onComplete?: () => void
) => {
  const changeData = (data: any) => {
    return { ...data, events: [...data.events, eventId] };
  };

  const stepController = async (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF KONTINGEN HAVE OFFICIALS
        if (kontingen.officials.length) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // CONFIRM ADD OFFICIALS TO EVENT
        const officialsConfirmation = await confirm(
          "Tambahkan Official",
          `Terdapat ${kontingen.officials.length} official tergabung dalam ${kontingen.namaKontingen}, apakah ${kontingen.officials.length} official tersebut akan diikutsertakan ke event ini?`
        );
        if (officialsConfirmation) {
          stepController(3);
        } else {
          stepController(4);
        }
        break;
      case 3:
        // ADD OFFICIALS TO EVENT
        updatePersons(
          kontingenOfficials,
          "official",
          changeData,
          toastId,
          dispatch,
          () => stepController(4)
        );
        break;
      case 4:
        // CHECK IF KONTINGEN HAVE PESERTAS
        if (kontingen.pesertas.length) {
          stepController(5);
        } else {
          stepController(7);
        }
        break;
      case 5:
        // CONFIRM ADD PESERTAS TO EVENT
        const pesertasConfirmation = await confirm(
          "Tambahkan Peserta",
          `Terdapat ${kontingen.pesertas.length} peserta tergabung dalam ${kontingen.namaKontingen}, apakah ${kontingen.pesertas.length} peserta tersebut akan diikutsertakan ke event ini?`
        );
        if (pesertasConfirmation) {
          stepController(6);
        } else {
          stepController(7);
        }
        break;
      case 6:
        // ADD PESERTAS TO EVENT
        updatePersons(
          kontingenPesertas,
          "peserta",
          changeData,
          toastId,
          dispatch,
          () => stepController(7)
        );
        break;
      case 7:
        // ADD KONTINGEN TO EVENT
        const newKontingen = changeData(kontingen);
        updateKontingen(
          newKontingen,
          kontingen,
          kontingenOfficials,
          kontingenPesertas,
          dispatch,
          toastId,
          eventId,
          () => {
            onComplete && onComplete();
          }
        );
        break;
    }
  };
  stepController(1);
};

// DELETE KONTINGEN
export const deleteKontingen = async (
  kontingen: KontingenState,
  confirm: Confirm,
  kontingenOfficials: OfficialState[],
  kontingenPesertas: PesertaState[],
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  eventId: string,
  onComplete: () => void
) => {
  const changeData = (data: any) => ({
    ...data,
    idKontingen: "",
    namaKontingen: "",
  });

  const stepController = async (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF KONTINGEN HAVE OFFICIALS
        if (kontingen.officials.length) {
          stepController(2);
        } else {
          stepController(5);
        }
        break;
      case 2:
        // CONFIRM DELETE OFFICIALS
        const officialsConfirmation = await confirm(
          "Hapus Official",
          `Terdapat ${kontingen.officials.length} official tergabung dalam ${kontingen.namaKontingen}, apakah ${kontingen.officials.length} official tersebut akan ikut dihapus?`
        );
        if (officialsConfirmation) {
          stepController(3);
        } else {
          stepController(5);
        }
        break;
      case 3:
        // DELETE OFFICIALS
        deleteOfficials(
          kontingenOfficials,
          dispatch,
          toastId,
          kontingen,
          eventId,
          () => stepController(5),
          true
        );
        break;
      case 4:
        // DELETE KONTINGEN FROM OFFICIALS
        updatePersons(
          kontingenOfficials,
          "official",
          changeData,
          toastId,
          dispatch,
          () => stepController(5)
        );
        break;
      case 5:
        // CHECK IF KONTINGEN HAVE PESERTAS
        if (kontingen.pesertas.length) {
          stepController(6);
        } else {
          stepController(9);
        }
        break;
      case 6:
        // CONFIRM DELETE PESERTAS
        const pesertasConfirmation = await confirm(
          "Hapus Peserta",
          `Terdapat ${kontingen.pesertas.length} peserta tergabung dalam ${kontingen.namaKontingen}, apakah ${kontingen.pesertas.length} peserta tersebut akan ikut dihapus?`
        );
        if (pesertasConfirmation) {
          stepController(5);
        } else {
          stepController(7);
        }
        break;
      case 7:
        // DELETE PESERTAS
        deletePesertas(
          kontingenPesertas,
          dispatch,
          toastId,
          kontingen,
          eventId,
          () => stepController(9)
        );
        break;
      case 8:
        // DELETE KONTINGEN FROM PESERTAS
        updatePersons(
          kontingenPesertas,
          "peserta",
          changeData,
          toastId,
          dispatch,
          () => stepController(9)
        );
        break;
      case 9:
        // DELETE KONTINGEN
        controlToast("Menghapus kontingen", toastId, "loading");
        axios
          .delete(`/api/kontingens/${kontingen.creatorEmail}/${kontingen.id}`)
          .then((res) => {
            controlToast("Official berhasil dihapus", toastId, "success");
            dispatch(deleteKontingenRedux({ kontingen, eventId }));
            onComplete && onComplete();
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
    }
  };
  stepController(1);
};

export const deleteKontingenFromEvent = async (
  kontingen: KontingenState,
  officialsToDelete: OfficialState[],
  pesertasToDelete: PesertaState[],
  kontingenOfficials: OfficialState[],
  kontingenPesertas: PesertaState[],
  eventId: string,
  dispatch: Dispatch<UnknownAction>,
  toastId: React.MutableRefObject<Id | null>,
  onComplete: () => void
) => {
  const changeData = (data: any) => ({
    ...data,
    events: [...data.events].filter((item) => item != eventId),
  });
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE OFFICIALS FROM EVENT
        updatePersons(
          officialsToDelete,
          "official",
          changeData,
          toastId,
          dispatch,
          () => stepController(2),
          eventId
        );
        break;
      case 2:
        // DELETE PESERTAS FROM EVENT
        updatePersons(
          pesertasToDelete,
          "peserta",
          changeData,
          toastId,
          dispatch,
          () => stepController(3),
          eventId
        );
        break;
      case 3:
        // DELETE KONTINGEN FROM EVENT
        const newKontingen = changeData(kontingen);
        newKontingen[`${eventId}-pesertas`] &&
          delete newKontingen[`${eventId}-pesertas`];
        newKontingen[`${eventId}-officials`] &&
          delete newKontingen[`${eventId}-officials`];
        updateKontingen(
          newKontingen,
          kontingen,
          kontingenOfficials,
          kontingenPesertas,
          dispatch,
          toastId,
          eventId,
          onComplete
        );
        break;
    }
  };
  stepController(1);
};
