"use client";

import NotLoggedIn from "@/components/auth/NotLoggedIn";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import CenterBoxShadow from "@/components/utils/CenterBoxShadow";
import { firestore } from "@/utils/firebase/firebase";
import { PalInitialValue, PalState } from "@/utils/form/pal/palConstants";
import { jenisKelaminAtlet } from "@/utils/form/peserta/pesertaConstants";
import { controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { collection, doc } from "firebase/firestore";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const FormPal = () => {
  const [sent, setSent] = useState(false);

  const session = useSession();

  if (!session.data?.user?.email) return <NotLoggedIn />;

  const toastId = useRef(null);

  const sendPalRequest = (data: PalState) => {
    controlToast("Mendaftarkan akun anda", toastId, "loading", true);
    axios
      .post("/api/pal/request", {
        ...data,
        waktuPendaftaran: Date.now(),
      })
      .then((res) => {
        controlToast("Akun anda berhasil daftarkan", toastId, "success");
        setSent(true);
      })
      .catch((error) => {
        controlToast(
          error.response.data.message || "Akun anda gagal daftarkan",
          toastId,
          "success"
        );
      });
  };

  if (sent)
    return (
      <div className="flex flex-col items-center text-2xl gap-y-3">
        <IoIosCheckmarkCircleOutline className="text-6xl text-green-500" />
        <p className="text-center">
          Akun anda berhasil didaftarkan
          <br />
          <span className="text-lg">
            Mohon tunggu hingga akun anda diverifikasi oleh admin
          </span>
        </p>
      </div>
    );

  return (
    <div>
      <h1 className="page_title">Daftar Akun Atlet PAL</h1>
      <Formik
        initialValues={PalInitialValue}
        onSubmit={(values) => sendPalRequest(values)}
      >
        {({ values, setFieldValue, errors, touched, isSubmitting }) => {
          !values.email && setFieldValue("email", session.data?.user?.email);
          return (
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
                options={jenisKelaminAtlet}
              />
              <button
                className="btn_green mt-1"
                type="submit"
                disabled={isSubmitting}
              >
                Daftar
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default FormPal;
