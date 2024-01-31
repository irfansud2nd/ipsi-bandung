"use client";

import InputText from "@/components/inputs/InputText";
import {
  kontingenInitialValue,
  kontingenValidationSchema,
} from "@/utils/form/kontingen/kontingenConstants";
import { sendKontingen } from "@/utils/form/kontingen/kontingenFunctions";
import { Form, Formik } from "formik";

const FormKontingen = () => {
  return (
    <>
      <Formik
        initialValues={kontingenInitialValue}
        onSubmit={(values) => sendKontingen(values)}
        validationSchema={kontingenValidationSchema}
      >
        {({ errors, touched }) => (
          <Form className="flex gap-2 items-end">
            <InputText
              label="Nama Kontingen"
              name="namaKontingen"
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
export default FormKontingen;
