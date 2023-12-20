"use client";
import React from "react";
import FormPeserta from "./peserta/FormPeserta";
import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetData from "./GetData";

const Pendaftaran = () => {
  return (
    <Provider store={store}>
      <div>
        <ToastContainer />
        <GetData />
        <FormPeserta />
      </div>
    </Provider>
  );
};

export default Pendaftaran;
