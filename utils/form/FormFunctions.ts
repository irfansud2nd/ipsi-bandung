import axios from "axios";
import { KontingenState } from "./kontingen/kontingenConstants";
import { OfficialState } from "./official/officialConstants";
import { PesertaState } from "./peserta/pesertaConstants";
import { Id } from "react-toastify";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { controlToast, toastAxiosError } from "../shared/functions";
import { updateKontingenRedux } from "../redux/kontingens/kontingensSlice";
import { updateOfficialRedux } from "../redux/officials/officialsSlice";
import { updatePesertaRedux } from "../redux/pesertas/pesertasSlice";
import { axiosFileConfig } from "../shared/constants";
import { managePersonOnKontingen } from "./kontingen/kontingenFunctions";
import { updateOfficial } from "./official/officialFunctions";
import { updatePeserta } from "./peserta/pesertaFunctions";
import { FormikErrors } from "formik";

// GET REGISTERED
export const getRegistered = (state: any, data: any[], eventId?: string) => {
  if (!eventId) return;
  state.registered = data.filter(
    (data: KontingenState | PesertaState | OfficialState) =>
      data.events.includes(eventId)
  );
  state.unregistered = data.filter(
    (item: KontingenState | PesertaState | OfficialState) =>
      !item.events.includes(eventId)
  );
};

// ADD TO EVENT
export const addToEvent = (
  eventId: string,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  data: any,
  targetCollection: "kontingens" | "officials" | "pesertas",
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);

  controlToast(
    `Mendaftarkan ${targetCollection.slice(0, -1)} ke event`,
    toastId,
    "loading",
    true
  );

  const updatedData = {
    ...data,
    events: [...data.events, eventId],
  };

  axios
    .patch(`/api/participant/${targetCollection}`, updatedData)
    .then((res) => {
      controlToast(
        `${
          targetCollection.charAt(0).toUpperCase() +
          targetCollection.slice(1, -1)
        } berhasil didaftarkan ke event`,
        toastId,
        "success"
      );
      switch (targetCollection) {
        case "kontingens":
          dispatch(updateKontingenRedux({ eventId, kontingen: updatedData }));
          break;
        case "officials":
          dispatch(updateOfficialRedux({ eventId, official: updatedData }));
          break;
        case "pesertas":
          dispatch(updatePesertaRedux({ eventId, peserta: updatedData }));
          break;
      }
    })
    .catch((error) => {
      toastAxiosError(error, toastId);
    })
    .finally(() => setLoading(false));
};

// SEND FILE
export const sendFile = async (file: File, directory: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);
  return axios
    .post("/api/file", formData, axiosFileConfig)
    .then((res) => {
      return res.data.downloadUrl;
    })
    .catch((error) => {
      throw error;
    });
};

// ADD PERSON TO EVENT
export const addPersonToEvent = async (
  person: OfficialState | PesertaState,
  eventId: string,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  registeredKontingen: KontingenState,
  personType: "peserta" | "official",
  oldKontingen?: KontingenState
) => {
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF TRANSFER KONTINGEN
        if (oldKontingen) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE PERSON FROM OLD KONTINGEN
        if (!oldKontingen) return;
        controlToast(
          `Menghapus ${personType} ke ${oldKontingen.namaKontingen}`,
          toastId,
          "loading"
        );
        managePersonOnKontingen(
          oldKontingen,
          `${personType}s`,
          person.id,
          "delete",
          eventId
        )
          .then((kontingen) => {
            dispatch(updateKontingenRedux({ kontingen, eventId }));
            stepController(2);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 3:
        // ADD TO NEW KONTINGEN
        controlToast(
          `Mendaftarkan ${personType} ke ${registeredKontingen.namaKontingen}`,
          toastId,
          "loading"
        );
        managePersonOnKontingen(
          registeredKontingen,
          `${personType}s`,
          person.id,
          "add",
          eventId
        )
          .then((kontingen) => {
            dispatch(updateKontingenRedux({ kontingen, eventId }));
            stepController(2);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 4:
        // SET KONTINGEN NAME AND ID
        // ADD PERSON TO EVENT
        controlToast(
          `Mendaftarkan ${personType} ke event`,
          toastId,
          "loading",
          !oldKontingen
        );
        const data: OfficialState | PesertaState = {
          ...person,
          events: [...person.events, eventId],
          namaKontingen: registeredKontingen.namaKontingen,
          idKontingen: registeredKontingen.id,
        };
        const onComplete = () =>
          controlToast(
            `${
              personType.charAt(0).toUpperCase() + personType.slice(1)
            } berhasil didaftarkan ke event`,
            toastId,
            "success"
          );
        personType == "official"
          ? updateOfficial(
              data as OfficialState,
              dispatch,
              toastId,
              eventId,
              onComplete
            )
          : updatePeserta(
              data as PesertaState,
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

// DELETE PERSON FROM EVENT
export const deletePersonFromEvent = async (
  person: PesertaState | OfficialState,
  personType: "peserta" | "official",
  kontingen: KontingenState,
  eventId: string,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  onComplete?: () => void
) => {
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE FROM KONTINGEN[EVENTID-PERSONTYPE]
        controlToast(
          `Menghapus ${person.namaLengkap} dari Kontingen ${kontingen.namaKontingen} di event ini`,
          toastId,
          "loading",
          true
        );
        managePersonOnKontingen(
          kontingen,
          `${personType}s`,
          person.id,
          "delete",
          eventId,
          true
        )
          .then((kontingen) => {
            dispatch(updateKontingenRedux({ kontingen, eventId }));
            stepController(2);
          })
          .catch((error) => toastAxiosError(error, toastId));
        break;
      case 2:
        // UPDATE EVENT ON PERSON
        controlToast(
          `Menghapus ${person.namaLengkap} dari event`,
          toastId,
          "loading"
        );
        const after = () => {
          controlToast(
            `${person.namaLengkap} berhasil dihapus dari event`,
            toastId,
            "success"
          );
          onComplete && onComplete();
        };
        const data = {
          ...person,
          events: [...person.events].filter((item) => item != eventId),
        };
        personType == "official"
          ? updateOfficial(
              data as OfficialState,
              dispatch,
              toastId,
              eventId,
              after
            )
          : updatePeserta(
              data as PesertaState,
              dispatch,
              toastId,
              eventId,
              after
            );
        break;
    }
  };
  stepController(1);
};

// UPDATE PERSONS
export const updatePersons = (
  datas: OfficialState[] | PesertaState[],
  persontType: "peserta" | "official",
  changeData: (
    data: OfficialState | PesertaState
  ) => OfficialState | PesertaState,
  toastId: React.MutableRefObject<Id | null>,
  dispatch: Dispatch<UnknownAction>,
  onComplete: () => void,
  eventId?: string
) => {
  if (!datas || !datas.length) {
    onComplete();
    return;
  }
  const updateRepeater = (index: number) => {
    if (index >= datas.length) {
      onComplete();
      return;
    }
    controlToast(
      `Memperbaharui official ${index + 1}/${datas.length}`,
      toastId,
      "loading",
      true
    );
    const oldData = datas[index];
    const newData = changeData(oldData);
    const repeat = () => updateRepeater(index + 1);
    persontType == "official"
      ? updateOfficial(
          newData as OfficialState,
          dispatch,
          toastId,
          eventId,
          repeat
        )
      : updatePeserta(
          newData as PesertaState,
          dispatch,
          toastId,
          eventId,
          repeat
        );
  };
  updateRepeater(0);
};

// SET FIELD VALUES
export const setFieldValues = (
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<any>>,
  kontingen: any
) => {
  for (const key in kontingen) {
    setFieldValue(key, kontingen[key]);
  }
};
