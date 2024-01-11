"use client";

import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import {
  jabatanOfficials,
  jenisKelaminDewasa,
  officialInitialValue,
  officialValidationSchema,
} from "@/utils/form/official/officialConstants";
import { sendOfficial } from "@/utils/form/official/officialFunctions";
import { Form, Formik } from "formik";

const FormOfficial = () => {
  return (
    <>
      <Formik
        initialValues={officialInitialValue}
        onSubmit={(values) => sendOfficial(values)}
        validationSchema={officialValidationSchema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <InputFile
              setFieldValue={setFieldValue}
              label="Pas Foto"
              name="fotoFile"
              errors={errors}
              touched={touched}
              file={values.fotoFile}
            />
            <InputText
              label="Nama Lengkap"
              name="namaLengkap"
              errors={errors}
              touched={touched}
            />
            <InputSelect
              label="Jenis Kelamin"
              name="jenisKelamin"
              options={jenisKelaminDewasa}
            />
            <InputSelect
              label="Jabatan"
              name="jabatan"
              options={jabatanOfficials}
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
export default FormOfficial;
