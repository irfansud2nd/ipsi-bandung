"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "./QrScanner";
import InlineLoading from "@/components/loading/InlineLoading";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import axios, { AxiosError } from "axios";
import { controlToast } from "@/utils/shared/functions";
import { useSession } from "next-auth/react";
import CenterBoxShadow from "@/components/utils/CenterBoxShadow";
import { tipeKehadiran } from "@/utils/pal/absen/PalAbsenConstants";
import { getToday } from "@/utils/pal/absen/PalAbsenFunctions";

const Absen = () => {
  const session = useSession();
  const email = session.data?.user?.email;

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const toastId = useRef(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get("/api/pal/absen/token").then((res) => {
        if (token != res.data.token) {
          controlToast("QR Code Salah", toastId, "error", true);
          setToken("");
          setLoading(false);
        } else if (!res.data.status) {
          controlToast("QR Code tidak aktif", toastId, "error", true);
          setToken("");
          setLoading(false);
        } else {
          const now = new Date();
          const time = `${now.getHours()}:${now.getMinutes()}`;
          axios
            .patch("/api/pal/absen", {
              email,
              tipe: tipeKehadiran[0],
              time,
            })
            .catch((error) => {
              setToken("");
              controlToast(error.response.data.message, toastId, "error", true);
            })
            .finally(() => setLoading(false));
        }
      });
    }
  }, [token]);

  const forceHadir = () => {
    axios
      .patch("/api/pal/absen", {
        email,
        tipe: tipeKehadiran[0],
        time: getToday("hour+minute"),
      })
      .catch((error) => {
        setToken("");
        controlToast(error.response.data.message, toastId, "error", true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <CenterBoxShadow title="Absen Atlet PAL">
      <button onClick={forceHadir} className="btn_red">
        Force Hadir
      </button>
      {token ? (
        <div className="flex flex-col items-center text-2xl gap-y-3">
          {loading ? (
            <>
              <InlineLoading className="text-4xl" />
              <p>Menyimpan kehadiran</p>
            </>
          ) : (
            <>
              <IoIosCheckmarkCircleOutline className="text-6xl text-green-500" />
              <p>Kehadiran berhasil disimpan</p>
            </>
          )}
        </div>
      ) : (
        <QrScanner setResult={setToken} />
      )}
    </CenterBoxShadow>
  );
};
export default Absen;
