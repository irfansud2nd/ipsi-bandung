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
      <div className="flex border-b-black">
        {navs.map(({ name }, i) => (
          <>
            <button
              onClick={() => setPart(name)}
              className={`border border-black px-2 rounded-t-md font-semibold pb-0.5 ${
                name == part ? "border-b-0 border-2" : " border-b-2"
              }`}
            >
              {name}
            </button>
            {i != navs.length - 1 && (
              <span className="w-5 border-black border-b-2"></span>
            )}
          </>
        ))}
        <span className="border-b-2 border-b-black w-full"></span>
      </div>
      <div className="border-2 border-black border-t-0 p-1 rounded-b-md">
        {navs[navs.findIndex((nav) => nav.name == part)].component}
      </div>
      {/* <FormPeserta /> */}
      {/* <FormKontingen /> */}
      {/* <FormOfficial /> */}
    </Provider>
  );
};

export default Pendaftaran;
