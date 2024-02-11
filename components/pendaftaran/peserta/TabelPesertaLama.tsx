import { PesertaState } from "@/utils/form/peserta/pesertaConstants";
import { updatePesertaRedux } from "@/utils/redux/pesertas/pesertasSlice";
import { RootState } from "@/utils/redux/store";
import {
  controlToast,
  getEventIdByPathname,
  isEditOnly,
  toastAxiosError,
} from "@/utils/shared/functions";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TabelPesertaLama = () => {
  const [loading, setLoading] = useState(false);

  const pesertas = useSelector(
    (state: RootState) => state.pesertas.unregistered
  );
  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);

  const addPesertaToEvent = (peserta: PesertaState) => {
    setLoading(true);
    controlToast("Mendaftarkan peserta ke event", toastId, "loading", true);
    const data: PesertaState = {
      ...peserta,
      events: [...peserta.events, eventId],
    };
    axios
      .patch("/api/participant/pesertas", data)
      .then((res) => {
        controlToast(
          "Peserta berhasil didaftarkan ke event",
          toastId,
          "success"
        );
        dispatch(updatePesertaRedux({ eventId, peserta: data }));
      })
      .catch((error) => toastAxiosError(error, toastId))
      .finally(() => setLoading(false));
  };

  if (!pesertas.length)
    return (
      <p className="text-red-500">
        Tidak ada peserta yang belum di daftarkan ke event ini
      </p>
    );
  return (
    <table className="mb-1 w-fit h-fit">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Lengkap</th>
          <th>Jenis Kelamin</th>
          <th>TB|BB</th>
          <th>Nama Kontingen</th>
          <th>Tingkatan</th>
          <th>Jenis Pertandingan</th>
          <th>Kategori Tanding</th>
          {!isEditOnly(eventId) && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {pesertas.map((peserta, i) => (
          <tr key={peserta.id}>
            <td>{i + 1}</td>
            <td>{peserta.namaLengkap}</td>
            <td>{peserta.jenisKelamin}</td>
            <td>
              {peserta.tinggiBadan} CM | {peserta.beratBadan} KG
            </td>
            <td>{peserta.namaKontingen}</td>
            <td>{peserta.tingkatanPertandingan}</td>
            <td>{peserta.jenisPertandingan}</td>
            <td>{peserta.kategoriPertandingan}</td>
            <td>
              <button
                className="btn_green my-1"
                onClick={() => addPesertaToEvent(peserta)}
                disabled={loading}
              >
                Tambahkan
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TabelPesertaLama;
