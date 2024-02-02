import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import ErrorText from "../typography/ErrorText";

type InputTextAreaProps = {
  label: string;
  name: string;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
};

const InputTextArea = ({
  label,
  name,
  errors,
  touched,
}: InputTextAreaProps) => {
  return (
    <div className="flex flex-col w-[250px]">
      <label htmlFor={name}>{label}</label>
      <Field
        name={name}
        type="text"
        as="textarea"
        className={`outline-black border-2 border-black rounded-md resize-none h-20
        ${errors[name] && touched[name] && "border-red-500"}`}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputTextArea;
