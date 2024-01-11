"use client";
import InputDate from "@/components/inputs/InputDate";
import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import {
  jenisKelaminPeserta,
  jenisPertandingan,
  pesertaInitialValue,
  pesertaValidationSchema,
  tingkatanKategori,
} from "@/utils/form/peserta/pesertaConstants";
import {
  calculateAge,
  sendPeserta,
} from "@/utils/form/peserta/pesertaFunctions";
import { Form, Formik } from "formik";
import React from "react";

const FormPeserta = () => {
  const selectCategory = (
    tingkatan: string,
    pertandingan: string,
    jenisKelamin: string
  ) => {
    if (pertandingan == jenisPertandingan[0]) {
      return tingkatanKategori[
        tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriTanding;
    } else {
      if (jenisKelamin == jenisKelaminPeserta[0]) {
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

  return (
    <>
      <Formik
        initialValues={pesertaInitialValue}
        onSubmit={(values) => sendPeserta(values)}
        validationSchema={pesertaValidationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <InputText
              label="Nama Lengkap"
              name="namaLengkap"
              errors={errors}
              touched={touched}
            />
            <InputSelect
              label="Jenis Kelamin"
              name="jenisKelamin"
              options={jenisKelaminPeserta}
            />
            <InputTextArea
              label="Alamat Lengkap"
              name="alamatLengkap"
              errors={errors}
              touched={touched}
            />
            <InputText
              label="NIK"
              name="NIK"
              errors={errors}
              touched={touched}
            />
            <InputText
              label="Tempat Lahir"
              name="tempatLahir"
              errors={errors}
              touched={touched}
            />
            <InputDate errors={errors} touched={touched} />
            <InputText
              label="Berat Badan"
              name="beratBadan"
              errors={errors}
              touched={touched}
            />
            <InputText
              label="Tinggi Badan"
              name="tinggiBadan"
              errors={errors}
              touched={touched}
            />
            <InputSelect
              label="Jenis Pertandingan"
              name="jenisPertandingan"
              options={jenisPertandingan}
            />
            <InputSelect
              label="Tingkatan"
              name="tingkatanPertandingan"
              options={tingkatanKategori.map((item) => item.tingkatan)}
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
            />
            <InputFile
              setFieldValue={setFieldValue}
              label="KTP"
              name="ktpFile"
              errors={errors}
              touched={touched}
              file={values.ktpFile}
              under17
              umur={calculateAge(values.tanggalLahir)}
              landscape
            />
            <InputFile
              setFieldValue={setFieldValue}
              label="Kartu Keluarga"
              name="kkFile"
              errors={errors}
              touched={touched}
              file={values.kkFile}
              landscape
            />
            <InputFile
              setFieldValue={setFieldValue}
              label="Pas Foto"
              name="fotoFile"
              errors={errors}
              touched={touched}
              file={values.fotoFile}
            />
            <InputText
              label="Email"
              name="email"
              under17
              umur={calculateAge(values.tanggalLahir)}
              errors={errors}
              touched={touched}
            />
            <InputText
              label="No HP"
              name="noHp"
              under17
              umur={calculateAge(values.tanggalLahir)}
              errors={errors}
              touched={touched}
            />
            <button className="btn_green mt-1" type="submit">
              Simpan
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormPeserta;
