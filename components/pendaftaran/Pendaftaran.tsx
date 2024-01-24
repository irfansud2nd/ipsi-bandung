"use client";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import Kontingen from "./kontingen/Kontingen";
import Peserta from "./peserta/Peserta";
import Official from "./official/Official";
import Pembayaran from "./pembayaran/Pembayaran";

const Pendaftaran = () => {
  const [part, setPart] = useState("Kontingen");

  const navs = [
    {
      name: "Kontingen",
      component: <Kontingen />,
    },
    {
      name: "Official",
      component: <Official />,
    },
    {
      name: "Peserta",
      component: <Peserta />,
    },
    {
      name: "Pembayaran",
      component: <Pembayaran />,
    },
  ];

  return (
    <Provider store={store}>
      <div className="flex gap-5">
        {navs.map(({ name }) => (
          <>
            <button
              onClick={() => setPart(name)}
              className="btn_gray font-semibold pb-0.5"
            >
              {name}
            </button>
          </>
        ))}
      </div>
      {navs[navs.findIndex((nav) => nav.name == part)].component}
      {/* <FormPeserta /> */}
      {/* <FormKontingen /> */}
      {/* <FormOfficial /> */}
    </Provider>
  );
};

export default Pendaftaran;
