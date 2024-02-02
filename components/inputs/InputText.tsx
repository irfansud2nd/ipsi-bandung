import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import ErrorText from "../typography/ErrorText";

type InputTextProps = {
  label: string;
  name: string;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  under17?: boolean;
  umur?: number;
};

const InputText = ({
  label,
  name,
  under17,
  umur,
  errors,
  touched,
}: InputTextProps) => {
  return (
    <div className="flex flex-col w-[250px]">
      <label htmlFor={name}>
        {label}
        {under17 ? (
          umur && umur >= 17 ? (
            " Peserta"
          ) : (
            <span className="bg-yellow-300 rounded-md px-1 ml-1">
              {umur && umur >= 17 ? "Peserta" : "Orang Tua"}
            </span>
          )
        ) : null}
      </label>
      <Field
        name={name}
        type="text"
        className={`outline-black border-2 border-black px-1 ${
          errors[name] && touched[name] && "border-red-500"
        } rounded-md`}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputText;
