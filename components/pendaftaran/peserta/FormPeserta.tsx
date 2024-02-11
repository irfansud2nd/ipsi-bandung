"use client";
import InputDate from "@/components/inputs/InputDate";
import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import {
  PesertaState,
  jenisKelaminAtlet,
  jenisPertandingan,
  pesertaInitialValue,
  pesertaValidationSchema,
  tingkatanKategori,
} from "@/utils/form/peserta/pesertaConstants";
import {
  calculateAge,
  selectCategory,
  sendPeserta,
  updatePeserta,
} from "@/utils/form/peserta/pesertaFunctions";
import { Form, Formik } from "formik";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getEventIdByPathname } from "@/utils/shared/functions";
import { RootState } from "@/utils/redux/store";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import { setPesertaToEditRedux } from "@/utils/redux/pesertas/pesertasSlice";
import { setFieldValues } from "@/utils/form/FormFunctions";

const FormPeserta = () => {
  const [pesertaToEdit, setPesertaToEdit] = useState(pesertaInitialValue);

  const toastId = useRef(null);
  const session = useSession();
  const dispatch = useDispatch();
  const eventId = getEventIdByPathname(usePathname());

  const registeredKontingen = useSelector(
    (state: RootState) => state.kontingens.registered[0]
  );

  const peserta = useSelector((state: RootState) => state.pesertas.toEdit);

  useEffect(() => {
    if (peserta.id) {
      setPesertaToEdit(peserta);
    }
  }, [peserta]);

  const handleSubmit = (
    values: PesertaState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (pesertaToEdit.id) {
      const onComplete = () => {
        dispatch(setPesertaToEditRedux(pesertaInitialValue));
      };
      updatePeserta(
        peserta,
        dispatch,
        toastId,
        eventId,
        onComplete,
        resetForm,
        setSubmitting
      );
    } else {
      sendPeserta(
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
    if (pesertaToEdit.id) {
      dispatch(setPesertaToEditRedux(pesertaInitialValue));
    }
  };

  return (
    <>
      <Formik
        initialValues={pesertaInitialValue}
        onSubmit={(values, { setSubmitting, resetForm }) =>
          handleSubmit(values, resetForm, setSubmitting)
        }
        validationSchema={pesertaValidationSchema}
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
          if (pesertaToEdit.id && !values.id)
            setFieldValues(setFieldValue, pesertaToEdit);
          return (
            <Form>
              <InputText
                label="Nama Lengkap"
                name="namaLengkap"
                className="uppercase"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputSelect
                label="Jenis Kelamin"
                name="jenisKelamin"
                options={jenisKelaminAtlet}
                disabled={isSubmitting}
              />
              <InputTextArea
                label="Alamat Lengkap"
                name="alamatLengkap"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputText
                label="NIK"
                name="NIK"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputText
                label="Nama kontingen"
                name="namaKontingen"
                errors={errors}
                touched={touched}
                disabled={true}
              />
              <InputText
                label="Tempat Lahir"
                name="tempatLahir"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputDate
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputText
                label="Berat Badan"
                name="beratBadan"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputText
                label="Tinggi Badan"
                name="tinggiBadan"
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputSelect
                label="Jenis Pertandingan"
                name="jenisPertandingan"
                options={jenisPertandingan}
                disabled={isSubmitting}
              />
              <InputSelect
                label="Tingkatan"
                name="tingkatanPertandingan"
                options={tingkatanKategori.map((item) => item.tingkatan)}
                disabled={isSubmitting}
              />
              <InputSelect
                label="Kategori Pertandingan"
                name="kategoriPertandingan"
                options={selectCategory(
                  values.tingkatanPertandingan,
                  values.jenisPertandingan,
                  values.jenisKelamin
                )}
                setFieldValue={setFieldValue}
                disabled={isSubmitting}
              />
              <InputFile
                setFieldValue={setFieldValue}
                label="KTP"
                name="ktpFile"
                downloadUrl={values.downloadKtpUrl}
                errors={errors}
                touched={touched}
                file={values.ktpFile}
                under17
                umur={calculateAge(values.tanggalLahir)}
                landscape
                disabled={isSubmitting}
              />
              <InputFile
                setFieldValue={setFieldValue}
                label="Kartu Keluarga"
                name="kkFile"
                downloadUrl={values.downloadKkUrl}
                errors={errors}
                touched={touched}
                file={values.kkFile}
                landscape
                disabled={isSubmitting}
              />
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
                label="Email"
                name="email"
                under17
                umur={calculateAge(values.tanggalLahir)}
                errors={errors}
                touched={touched}
                disabled={isSubmitting}
              />
              <InputText
                label="No HP"
                name="noHp"
                under17
                umur={calculateAge(values.tanggalLahir)}
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
    </>
  );
};

export default FormPeserta;
