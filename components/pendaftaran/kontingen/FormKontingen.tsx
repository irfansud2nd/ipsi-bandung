"use client";

import InputText from "@/components/inputs/InputText";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import { setFieldValues } from "@/utils/form/FormFunctions";
import {
  KontingenState,
  kontingenInitialValue,
  kontingenValidationSchema,
} from "@/utils/form/kontingen/kontingenConstants";
import {
  sendKontingen,
  updateKontingen,
} from "@/utils/form/kontingen/kontingenFunctions";
import { setKontingenToEditRedux } from "@/utils/redux/kontingens/kontingensSlice";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname } from "@/utils/shared/functions";
import { Form, Formik, FormikErrors } from "formik";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FormKontingen = () => {
  const [kontingenToEdit, setKontingenToEdit] = useState(kontingenInitialValue);

  const toastId = useRef(null);
  const session = useSession();
  const dispatch = useDispatch();
  const eventId = getEventIdByPathname(usePathname());

  const kontingen = useSelector((state: RootState) => state.kontingens.toEdit);

  useEffect(() => {
    if (kontingen.id) {
      setKontingenToEdit(kontingen);
    }
  }, [kontingen]);

  const kontingenOfficials = useSelector(
    (state: RootState) => state.officials.all
  );
  const kontingenPesertas = useSelector(
    (state: RootState) => state.pesertas.all
  );

  const handleSubmit = (
    values: KontingenState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (kontingenToEdit.id) {
      const onComplete = () => {
        setSubmitting(false);
        handleCancel(resetForm);
      };
      updateKontingen(
        values,
        kontingenToEdit,
        kontingenOfficials,
        kontingenPesertas,
        dispatch,
        toastId,
        eventId,
        onComplete,
        resetForm,
        setSubmitting
      );
    } else {
      sendKontingen(
        values,
        resetForm,
        setSubmitting,
        toastId,
        dispatch,
        eventId
      );
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    if (kontingenToEdit.id) {
      dispatch(setKontingenToEditRedux(kontingenInitialValue));
      setKontingenToEdit(kontingenInitialValue);
    }
  };

  return (
    <Formik
      initialValues={kontingenInitialValue}
      onSubmit={(values, { resetForm, setSubmitting }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={kontingenValidationSchema}
    >
      {({
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        values,
        resetForm,
      }) => {
        !values.creatorEmail &&
          setFieldValue("creatorEmail", session.data?.user?.email);
        if (kontingenToEdit.id && !values.id)
          setFieldValues(setFieldValue, kontingenToEdit);
        return (
          <Form>
            <InputText
              className="uppercase"
              label="Nama Kontingen"
              name="namaKontingen"
              errors={errors}
              touched={touched}
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
export default FormKontingen;
