"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { PalState } from "@/utils/form/pal/palConstants";
import { compare, controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TandaAbsen from "./TandaAbsen";
import AbsenEditor from "./AbsenEditor";
import {
  checkAbsen,
  getDaysInMonth,
  getToday,
  sumAbsen,
} from "@/utils/pal/absen/PalAbsenFunctions";
import { tipeKehadiran } from "@/utils/pal/absen/PalAbsenConstants";
import { useDownloadExcel } from "react-export-table-to-excel";
import Accordion from "@/components/utils/Accordion";
import Switch from "react-switch";

const RekapAbsen = () => {
  const [month, setMonth] = useState(getToday("month+year"));
  const [pals, setPals] = useState<PalState[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(false);

  const toastId = useRef(null);
  const tabelRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: `Rekap Absen ${month}`,
    sheet: month,
  });

  const getData = () => {
    setLoading(true);
    axios
      .get("/api/pal")
      .then((res) => {
        setPals(res.data.pals);
      })
      .catch((error) => {
        controlToast(error.response.data.message, toastId, "error", true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="flex gap-1 flex-wrap">
        <input
          type="month"
          onChange={(e) => setMonth(e.target.value)}
          value={month}
          className="rounded-md px-1"
        />
        <button
          className="btn_green text-sm"
          onClick={getData}
          disabled={loading}
        >
          Refresh
        </button>
        {loading && (
          <p>
            Loading...
            <InlineLoading />
          </p>
        )}
        <div className="flex gap-1 items-center">
          <p>Tampilkan Waktu</p>
          <Switch
            onChange={() => setShowTimestamp((prev) => !prev)}
            checked={showTimestamp}
            offColor="#ef4444"
          />
        </div>
        {/* <IsAuthorized access="master" returnNull>
            | <AbsenCompresser pals={pals} />
          </IsAuthorized> */}
      </div>
      {!pals.length ? null : (
        <>
          <button className="btn_green text-sm" onClick={onDownload}>
            Download
          </button>
          <div className="max-w-full overflow-x-auto">
            <table className="text-sm w-full" ref={tabelRef}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Lengkap</th>
                  {getDaysInMonth(month).map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                  <th>Hadir</th>
                  <th>Izin</th>
                  <th>Sakit</th>
                  <th>Alfa</th>
                </tr>
              </thead>
              <tbody>
                {pals.sort(compare("namaLengkap", "asc")).map((item, i) => (
                  <tr key={item.email}>
                    <td>{i + 1}</td>
                    <td className="whitespace-nowrap">{item.namaLengkap}</td>
                    {getDaysInMonth(month).map((day) => {
                      const { tipe, time, byPelatih } = checkAbsen(
                        item,
                        month,
                        day
                      );
                      return (
                        <TandaAbsen
                          as="td"
                          key={day}
                          ket={tipe}
                          time={time}
                          showTimestamp={showTimestamp}
                          byAdmin={byPelatih}
                        />
                      );
                    })}
                    {sumAbsen(item, month)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Accordion title="Edit & Absen Manual" className="mt-1 w-fit">
            <AbsenEditor data={pals} month={month} setPals={setPals} />
          </Accordion>
          <Accordion title="Keterangan" className="mt-1 w-fit">
            <div className="flex gap-1 whitespace-nowrap flex-wrap">
              {tipeKehadiran.map((item) => (
                <p className="capitalize" key={item}>
                  <TandaAbsen as="span" ket={item} time="-" /> = {item}
                </p>
              ))}
              <p>
                <TandaAbsen as="span" ket="hadir" byAdmin time="-" /> = Oleh
                pelatih
              </p>
            </div>
          </Accordion>
        </>
      )}
    </div>
  );
};
export default RekapAbsen;
