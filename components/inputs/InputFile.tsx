"use client";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { controlToast } from "@/utils/shared/functions";
import { Id } from "react-toastify";
import { PesertaState } from "@/utils/form/peserta/pesertaConstants";
import ErrorText from "../typography/ErrorText";

type InputFileProps = {
  label: string;
  name: string;
  file: File | undefined;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  disabled: boolean;
  downloadUrl: string;
  landscape?: boolean;
  under17?: boolean;
  umur?: number;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<PesertaState>>;
};

const InputFile = ({
  label,
  name,
  under17,
  umur,
  file,
  landscape,
  setFieldValue,
  errors,
  touched,
  disabled,
  downloadUrl,
}: InputFileProps) => {
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(null);

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFieldValue(name, "");
    setImagePreviewSrc("");
  };

  // SET PREVIEW IF DOWNLOADURL
  useEffect(() => {
    if (!file) setImagePreviewSrc(downloadUrl);
  }, [downloadUrl, file]);

  // VALIDATE FILE SIZE AND FORMAT
  useEffect(() => {
    const maxSize = 1 * 1024 * 1024; //1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && toastId) {
      if (file.size > maxSize) {
        controlToast(
          "File yang anda pilih lebih dari 1MB",
          toastId,
          "error",
          true
        );
        clearInputImage();
      } else if (!allowedTypes.includes(file.type)) {
        controlToast(
          "File yang dipilih tidak valid (harus png, jpg, jpeg)",
          toastId,
          "error",
          true
        );
        clearInputImage();
      } else {
        setImagePreviewSrc(URL.createObjectURL(file));
      }
    } else {
      clearInputImage();
    }
  }, [file]);

  return (
    <>
      <div className="flex flex-col">
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
        <div
          className={`border-2 border-black ${
            errors[name] && touched[name] && "border-red-500"
          } rounded-md 
          ${landscape ? "w-[250px] h-[150px]" : "w-[150px] h-[200px]"}
          flex justify-center items-center`}
        >
          {imagePreviewSrc && (
            <img
              src={imagePreviewSrc}
              className={landscape ? "w-fit h-full" : "w-full h-fit"}
            />
          )}
        </div>
        <input
          ref={inputRef}
          onChange={(e) => {
            e.target.files?.length && setFieldValue(name, e.target.files[0]);
          }}
          accept=".jpg, .jpeg, .png"
          name={name}
          type="file"
          className={landscape ? "input_file_landscape" : "input_file"}
          disabled={disabled}
        />
        <ErrorMessage name={name} component={ErrorText} />
      </div>
    </>
  );
};

export default InputFile;
