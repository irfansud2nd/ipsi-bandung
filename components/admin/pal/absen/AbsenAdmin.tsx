"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Switch from "react-switch";
import Link from "next/link";

const AbsenAdmin = () => {
  const [token, setToken] = useState("");
  const [tokenStatus, setTokenStatus] = useState(false);
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const toastId = useRef(null);

  const saveToken = () => {
    setLoadingGenerate(true);
    const token = uuidv4();
    axios
      .post("/api/pal/absen/token", { token })
      .then((res) => {
        setToken(res.data.token);
        setTokenStatus(res.data.status);
      })
      .catch((error) =>
        controlToast(error.response.data.message, toastId, "error")
      )
      .finally(() => setLoadingGenerate(false));
  };

  const changeTokenStatus = () => {
    setLoadingStatus(true);
    controlToast("Merubah status token", toastId, "loading", true);
    axios
      .patch("/api/pal/absen/token", { status: !tokenStatus })
      .then((res) => {
        setTokenStatus(res.data.status);
        controlToast("Status token berhasil dirubah", toastId, "success");
      })
      .catch((error) =>
        controlToast(error.response.data.message, toastId, "error")
      )
      .finally(() => setLoadingStatus(false));
  };

  const getToken = () => {
    axios
      .get("/api/pal/absen/token")
      .then((res) => {
        setTokenStatus(res.data.status);
        setToken(res.data.token);
      })
      .finally(() => setLoadingToken(false));
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div className="w-full h-full sm:max-w-[500px] sm:max-h-[400px] shadow-2xl rounded-md bg-gray-50 flex justify-center items-center border-2 border-gray-300">
      {loadingToken ? (
        <div className="flex flex-col items-center text-2xl gap-y-3">
          <InlineLoading className="text-4xl" />
          <p>Loading QR Code Absensi</p>
        </div>
      ) : token ? (
        <div className="flex flex-col gap-y-5 items-center">
          <QRCodeSVG value={token} size={250} />
          {/* <button
            onClick={changeTokenStatus}
            className={`text-xl ${tokenStatus ? "btn_green" : "btn_red"}`}
            disabled={loadingStatus}
          >
            Status {tokenStatus ? "Aktif" : "Nonaktif"}
          </button> */}
          <div className="flex gap-1 justify-center items-center font-bold">
            <Link href={"absen/rekap"} className="btn_green text-base">
              Rekap & Edit
            </Link>
            <p className={`${tokenStatus ? "text-green-500" : "text-red-500"}`}>
              QR {tokenStatus ? "Aktif" : "Nonaktif"}
            </p>
            <Switch
              onChange={changeTokenStatus}
              checked={tokenStatus}
              offColor="#ef4444"
              disabled={loadingStatus}
            />
          </div>
        </div>
      ) : (
        <button
          className={`btn_green text-2xl`}
          onClick={() => saveToken()}
          disabled={loadingGenerate}
        >
          {loadingGenerate ? "Generating" : "Generate"} Qr Code{" "}
          {loadingGenerate && <InlineLoading />}
        </button>
      )}
    </div>
  );
};
export default AbsenAdmin;
