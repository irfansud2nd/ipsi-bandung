"use client";
import { useState } from "react";
import Kontingen from "./kontingen/Kontingen";
import Peserta from "./peserta/Peserta";
import Official from "./official/Official";
import Pembayaran from "./pembayaran/Pembayaran";

import FullLoading from "../loading/FullLoading";
import { store } from "@/utils/redux/store";
import { Provider } from "react-redux";
import GetUserData from "./GetUserData";

const Pendaftaran = () => {
  const [part, setPart] = useState("Kontingen");
  const [loading, setLoading] = useState(0);

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
    <div className="w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex gap-3 border-b-2 border-b-black mb-1 h-fit">
        {navs.map(({ name }, i) => (
          <button
            key={name}
            onClick={() => setPart(name)}
            className={`pb-2 transition-all hover:bg-white px-1 rounded-md rounded-b-none
          ${name == part ? "font-semibold bg-white" : ""} `}
          >
            {name}
          </button>
        ))}
      </div>
      <Provider store={store}>
        <GetUserData setLoading={setLoading} />
        {loading >= 3 ? (
          navs[navs.findIndex((nav) => nav.name == part)].component
        ) : (
          <FullLoading text="Memuat data" />
        )}
      </Provider>
    </div>
  );
};

export default Pendaftaran;
