"use client";
import { PalState } from "@/utils/form/pal/palConstants";
import { getDaysInMonth, getToday } from "@/utils/pal/absen/PalAbsenFunctions";
import { controlToast, toastAxiosError } from "@/utils/shared/functions";
import axios from "axios";
import { useRef, useState } from "react";

const AbsenCompresser = ({ pals }: { pals: PalState[] }) => {
  const toastId = useRef(null);
  const [monthToCompress, setMonthToCompress] = useState(
    getToday("month+year")
  );

  const compressAbsen = (data: Record<string, string[]>) => {
    const days = getDaysInMonth(monthToCompress);

    let izin: string[] = [];
    let hadir: string[] = [];
    let sakit: string[] = [];
    let alfa: string[] = [];
    if (
      data[`${monthToCompress}-izin`] &&
      data[`${monthToCompress}-izin`].length
    )
      izin = data[`${monthToCompress}-izin`];
    if (
      data[`${monthToCompress}-sakit`] &&
      data[`${monthToCompress}-sakit`].length
    )
      sakit = data[`${monthToCompress}-sakit`];
    if (
      data[`${monthToCompress}-hadir`] &&
      data[`${monthToCompress}-hadir`].length
    )
      hadir = data[`${monthToCompress}-hadir`];

    alfa = days.filter(
      (day) =>
        izin.indexOf(day) < 0 &&
        sakit.indexOf(day) < 0 &&
        hadir.indexOf(day) < 0
    );
    const result = {
      izin,
      sakit,
      alfa,
    };
    return result;
  };

  const sendCompressedAbsen = (uncompressedPals: PalState[], index: number) => {
    if (index >= uncompressedPals.length) {
      controlToast("Compressed Succesfully", toastId, "success");
      return;
    }
    controlToast(
      `Compressing Absen ${index + 1}/${uncompressedPals.length}`,
      toastId,
      "loading",
      index == 0
    );
    const pal = uncompressedPals[index];
    axios
      .patch("/api/pal/absen/compress", {
        email: pal.email,
        month: monthToCompress,
        compressedAbsen: compressAbsen(pal),
      })
      .then((res) => sendCompressedAbsen(uncompressedPals, index + 1))
      .catch((error) => {
        toastAxiosError(error, toastId);
      });
  };

  return (
    <>
      <input
        type="month"
        onChange={(e) => setMonthToCompress(e.target.value)}
        value={monthToCompress}
      />
      <button
        onClick={() =>
          sendCompressedAbsen(
            pals.filter((pal) => !pal[`${monthToCompress}-compressed`]),
            0
          )
        }
        className="btn_green"
      >
        Compress
      </button>
    </>
  );
};
export default AbsenCompresser;
