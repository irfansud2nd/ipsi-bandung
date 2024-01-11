"use client";
import React from "react";
import FormPeserta from "./peserta/FormPeserta";
import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormKontingen from "./kontingen/FormKontingen";
import FormOfficial from "./official/FormOfficial";

const Pendaftaran = () => {
  return (
    <Provider store={store}>
      <div>
        {/* <ToastContainer /> */}
        {/* <FormPeserta /> */}
        {/* <FormKontingen /> */}
        {/* <FormOfficial /> */}
      </div>
    </Provider>
  );
};

export default Pendaftaran;
