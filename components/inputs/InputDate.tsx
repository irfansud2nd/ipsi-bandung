import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import ErrorText from "../typography/ErrorText";
type InputDateProps = {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
};
const InputDate = ({ errors, touched }: InputDateProps) => {
  return (
    <div className="flex flex-col w-[250px]">
      <label htmlFor="tanggalLahir">Tanggal Lahir</label>
      <Field
        type="date"
        name="tanggalLahir"
        className={`outline-black border-2 border-black ${
          errors.tanggalLahir && touched.tanggalLahir && "border-red-500"
        } rounded-md`}
      />
      <ErrorMessage name="tanggalLahir" component={ErrorText} />
    </div>
  );
};

export default InputDate;
