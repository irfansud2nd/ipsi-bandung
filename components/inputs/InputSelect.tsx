import { PesertaState } from "@/utils/form/pesertaConstants";
import { Field, FormikErrors } from "formik";
import React, { useEffect } from "react";

type InputSelectProps = {
  name: string;
  label: string;
  options: any[];
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<PesertaState>>;
};

const InputSelect = ({
  name,
  label,
  options,
  setFieldValue,
}: InputSelectProps) => {
  useEffect(() => {
    if (options.length && setFieldValue) {
      setFieldValue(name, options[0]);
    }
  }, [options]);

  return (
    <div className="flex flex-col w-[250px]">
      <label htmlFor={name}>{label}</label>
      <Field
        name={name}
        as="select"
        className="outline-black border-2 border-black rounded-md"
      >
        {options.map((option) => (
          <option value={option} className="bg-white" key={option}>
            {option}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default InputSelect;
