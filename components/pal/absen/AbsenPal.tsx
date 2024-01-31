"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "./QrScanner";
import InlineLoading from "@/components/loading/InlineLoading";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
import { controlToast } from "@/utils/shared/functions";
import { useSession } from "next-auth/react";

const Absen = () => {
  const session = useSession();
  const email = session.data?.user?.email;

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const toastId = useRef(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get("/api/absen/token").then((res) => {
        if (token != res.data.token) {
          controlToast("QR Code Salah", toastId, "error", true);
          setToken("");
          setLoading(false);
        } else {
          axios
            .post("/api/absen", { email })
            .catch((err) => {
              setToken("");
              controlToast(err.message, toastId, "error", true);
            })
            .finally(() => setLoading(false));
        }
      });
    }
  }, [token]);

  return (
    <div className="w-full h-full sm:max-w-[500px] sm:max-h-[400px] shadow-2xl rounded-md bg-gray-50 flex justify-center items-center border-2 border-gray-300 p-2">
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
    </div>
  );
};
export default Absen;
