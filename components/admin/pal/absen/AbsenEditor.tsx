import Accordion from "@/components/utils/Accordion";
import { PalState } from "@/utils/form/pal/palConstants";
import { tipeKehadiran } from "@/utils/pal/absen/PalAbsenConstants";
import { getDaysInMonth, getToday } from "@/utils/pal/absen/PalAbsenFunctions";
import {
  compare,
  controlToast,
  toastAxiosError,
} from "@/utils/shared/functions";
import axios from "axios";
import { error } from "console";
import { useEffect, useRef, useState } from "react";

type Props = {
  data: PalState[];
  month: string;
  setPals: React.Dispatch<React.SetStateAction<PalState[]>>;
};

const AbsenEditor = ({ data, month, setPals }: Props) => {
  const pals = data.filter((pal) => !pal[`${month}-compressed`]);

  if (!pals.length)
    return (
      <p className="text-red-500">
        Absen semua atlet sudah di-compress, tidak dapat diedit
      </p>
    );

  const [target, setTarget] = useState(pals[0].email);
  const [tipe, setTipe] = useState(tipeKehadiran[0]);
  const [day, setDay] = useState(getToday("day"));
  const [loading, setLoading] = useState(false);
  const [tipeBefore, setTipeBefore] = useState("");

  const toastId = useRef(null);

  const days = getDaysInMonth(month);

  const sendAbsen = () => {
    setLoading(true);
    controlToast("Menyimpan absen", toastId, "loading", true);
    axios
      .patch("/api/pal/absen", {
        email: target,
        tipe,
        month,
        day,
      })
      .then((res) => {
        controlToast("Absen berhasil disimpan", toastId, "success");
        updatePals();
      })
      .catch((error) => toastAxiosError(error, toastId))
      .finally(() => setLoading(false));
  };

  const updatePals = () => {
    const updatedPals = pals.filter((pal) => pal.email != target);
    let updatedPal = pals.filter((pal) => pal.email == target)[0];
    updatedPal = tipeBefore
      ? {
          ...updatedPal,
          [`${month}-${tipeBefore}`]: updatedPal[
            `${month}-${tipeBefore}`
          ].filter((item: string[]) => item.indexOf(day) < 0),
          [`${month}-${tipe}`]: [...updatedPal[`${month}-${tipe}`], day],
        }
      : {
          ...updatedPal,
          [`${month}-${tipe}`]: [...updatedPal[`${month}-${tipe}`], day],
        };
    updatedPals.push(updatedPal);
    setPals(updatedPals);
  };

  const checkAbsen = () => {
    const pal = pals[pals.findIndex((pal) => pal.email == target)];
    let tipeBefore;
    tipeKehadiran.map((tipe) => {
      if (
        pal[`${month}-${tipe}`] &&
        pal[`${month}-${tipe}`].indexOf(day) >= 0
      ) {
        tipeBefore = tipe;
      }
    });
    tipeBefore
      ? setTipeBefore(tipeBefore)
      : getToday("day") > day
      ? setTipeBefore(tipeKehadiran[3])
      : setTipeBefore("");
  };

  useEffect(() => {
    if (pals.length && target) checkAbsen();
  }, [day, target, pals]);

  useEffect(() => {
    tipeBefore ? setTipe(tipeBefore) : setTipe(tipeKehadiran[0]);
  }, [tipeBefore]);

  useEffect(() => {
    const daysLength = getDaysInMonth(month).length;
    if (Number(day) > daysLength) setDay(daysLength.toString());
  }, [month]);

  return (
    <div className="flex gap-1">
      <select
        onChange={(e) => setTarget(e.target.value)}
        value={target}
        disabled={loading}
      >
        {pals.sort(compare("namaLengkap", "asc")).map((pal) => (
          <option value={pal.email} key={pal.email}>
            {pal.namaLengkap}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setDay(e.target.value)}
        value={day}
        disabled={loading}
      >
        {days.map((day) => (
          <option value={day} key={day}>
            {day}
          </option>
        ))}
      </select>
      <select
        className="capitalize"
        onChange={(e) => setTipe(e.target.value)}
        value={tipe}
        disabled={loading}
      >
        {tipeKehadiran.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <button className="btn_green" onClick={sendAbsen} disabled={loading}>
        Save
      </button>
    </div>
  );
};
export default AbsenEditor;
