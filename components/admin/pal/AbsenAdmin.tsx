"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AbsenAdmin = () => {
  const [token, setToken] = useState("");
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const toastId = useRef(null);

  const saveToken = () => {
    setLoadingGenerate(true);
    const token = uuidv4();
    axios
      .post("/api/absen/token", { token })
      .then((res) => {
        setToken(res.data.token);
      })
      .catch((err) => controlToast(err.message, toastId, "error"))
      .finally(() => setLoadingGenerate(false));
  };

  const getToken = () => {
    axios
      .get("/api/absen/token")
      .then((res) => setToken(res.data.token))
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
        <div>
          <QRCodeSVG value={token} size={250} />
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
