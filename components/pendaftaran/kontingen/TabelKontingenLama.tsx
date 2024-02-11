import { addToEvent } from "@/utils/form/FormFunctions";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import { updateKontingenRedux } from "@/utils/redux/kontingens/kontingensSlice";
import { RootState } from "@/utils/redux/store";
import {
  controlToast,
  getEventIdByPathname,
  toastAxiosError,
} from "@/utils/shared/functions";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TabelKontingenLama = () => {
  const [loading, setLoading] = useState(false);

  const kontingens = useSelector(
    (state: RootState) => state.kontingens.unregistered
  );
  const registeredKontingens = useSelector(
    (state: RootState) => state.kontingens.registered
  );
  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);

  const addKontingenToEvent = (kontingen: KontingenState) => {
    addToEvent(eventId, toastId, dispatch, kontingen, "kontingens", setLoading);
  };

  if (!kontingens.length)
    return (
      <p className="text-red-500">
        Tidak ada Kontingen yang belum di daftarkan ke event ini
      </p>
    );

  return (
    <>
      {registeredKontingens.length ? (
        <p className="text-yellow-600">
          1 akun hanya diperbolehkan mendaftarkan 1 kontingen per event
        </p>
      ) : null}
      <table className="mt-1">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            {!registeredKontingens.length && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {kontingens.map((kontingen, i) => (
            <tr key={kontingen.id}>
              <td>{i + 1}</td>
              <td>{kontingen.namaKontingen}</td>
              {!registeredKontingens.length && (
                <td>
                  <button
                    className="btn_green my-1"
                    onClick={() => addKontingenToEvent(kontingen)}
                    disabled={loading}
                  >
                    Tambahkan
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TabelKontingenLama;
