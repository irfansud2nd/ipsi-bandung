"use client";

import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import { setFieldValues } from "@/utils/form/FormFunctions";
import {
  OfficialState,
  jabatanOfficials,
  jenisKelaminDewasa,
  officialInitialValue,
  officialValidationSchema,
} from "@/utils/form/official/officialConstants";
import {
  sendOfficial,
  updateOfficial,
} from "@/utils/form/official/officialFunctions";
import {
  addOfficialRedux,
  setOfficialToEditRedux,
} from "@/utils/redux/officials/officialsSlice";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname } from "@/utils/shared/functions";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FormOfficial = () => {
  const [officialToEdit, setOfficialToEdit] = useState(officialInitialValue);

  const toastId = useRef(null);
  const session = useSession();
  const dispatch = useDispatch();
  const eventId = getEventIdByPathname(usePathname());

  const registeredKontingen = useSelector(
    (state: RootState) => state.kontingens.registered[0]
  );

  const official = useSelector((state: RootState) => state.officials.toEdit);

  useEffect(() => {
    if (official.id) {
      setOfficialToEdit(official);
    }
  }, [official]);

  const handleSubmit = (
    values: OfficialState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (officialToEdit.id) {
      const onComplete = () => {
        setSubmitting(false);
        dispatch(setOfficialToEditRedux(officialInitialValue));
      };
      updateOfficial(
        official,
        dispatch,
        toastId,
        eventId,
        onComplete,
        resetForm,
        setSubmitting
      );
    } else {
      sendOfficial(
        values,
        resetForm,
        setSubmitting,
        toastId,
        dispatch,
        eventId,
        registeredKontingen
      );
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    if (officialToEdit.id) {
      dispatch(setOfficialToEditRedux(officialInitialValue));
    }
  };

  return (
    <Formik
      initialValues={officialInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={officialValidationSchema}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        isSubmitting,
        resetForm,
      }) => {
        !values.creatorEmail &&
          setFieldValue("creatorEmail", session.data?.user?.email);
        if (registeredKontingen) {
          !values.idKontingen &&
            setFieldValue("idKontingen", registeredKontingen.id);
          !values.namaKontingen &&
            setFieldValue("namaKontingen", registeredKontingen.namaKontingen);
        }
        if (officialToEdit.id && !values.id)
          setFieldValues(setFieldValue, officialToEdit);

        return (
          <Form>
            <InputFile
              setFieldValue={setFieldValue}
              label="Pas Foto"
              name="fotoFile"
              downloadUrl={values.downloadFotoUrl}
              errors={errors}
              touched={touched}
              file={values.fotoFile}
              disabled={isSubmitting}
            />
            <InputText
              label="Nama Lengkap"
              name="namaLengkap"
              className="uppercase"
              errors={errors}
              touched={touched}
              disabled={isSubmitting}
            />
            {eventId && (
              <InputText
                label="Nama kontingen"
                name="namaKontingen"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            )}
            <InputSelect
              label="Jenis Kelamin"
              name="jenisKelamin"
              options={jenisKelaminDewasa}
              disabled={isSubmitting}
            />
            <InputSelect
              label="Jabatan"
              name="jabatan"
              options={jabatanOfficials}
              disabled={isSubmitting}
            />
            <button
              className="btn_red"
              type="button"
              onClick={() => handleCancel(resetForm)}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              className="btn_green mt-1"
              type="submit"
              disabled={isSubmitting}
            >
              Simpan
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
export default FormOfficial;
