import TabelActionButtons from "@/components/TabelActionButtons";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname, isEditOnly } from "@/utils/shared/functions";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { OfficialState } from "@/utils/form/official/officialConstants";
import { useDispatch } from "react-redux";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import useConfirmationRodal from "@/components/rodal/useConfirmationRodal";
import { setOfficialToEditRedux } from "@/utils/redux/officials/officialsSlice";
import UnregisteredPersonButtons from "../UnregisteredPersonButtons";
import { deletePersonFromEvent } from "@/utils/form/FormFunctions";

type Props = {
  registered?: boolean;
};

const TabelOfficial = ({ registered }: Props) => {
  const registeredOfficials = useSelector(
    (state: RootState) => state.officials.registered
  );

  const unregisteredOfficials = useSelector(
    (state: RootState) => state.officials.unregistered
  );

  const allKontingens = useSelector((state: RootState) => state.kontingens.all);

  const [loading, setLoading] = useState(false);
  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);
  const { confirm, ConfirmationRodal } = useConfirmationRodal();

  // DELETE FROM EVENT
  const handleDelete = async (official: OfficialState) => {
    const result = await confirm(
      "hapus official dari event",
      `Apakah anda yakin untuk menghapus ${official.namaLengkap} dari event ini?`
    );
    if (!result) {
      return;
    }
    setLoading(true);
    const kontingen = allKontingens.find(
      (kontingen) => kontingen.id == official.idKontingen
    );
    deletePersonFromEvent(
      official,
      "official",
      kontingen as KontingenState,
      eventId,
      toastId,
      dispatch,
      () => setLoading(false)
    );
  };

  // EDIT OFFICIAL
  const handleEdit = (official: OfficialState) => {
    dispatch(setOfficialToEditRedux(official));
  };

  const officialsToMap = registered
    ? registeredOfficials
    : unregisteredOfficials;

  if (!registeredOfficials.length && registered)
    return (
      <p className="text-red-500">
        Belum ada official terdaftar untuk event ini
      </p>
    );

  if (!unregisteredOfficials.length && !registered)
    return (
      <p className="text-red-500">
        Tidak ada official yang belum di daftarkan ke event ini
      </p>
    );

  return (
    <>
      <ConfirmationRodal />
      <table className="mb-1 w-fit h-fit">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lengkap</th>
            <th>Jumlah Official</th>
            <th>Jumlah Peserta</th>
            <th>Nama Kontingen</th>
            {!isEditOnly(eventId) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {officialsToMap.map((official, i) => (
            <tr key={official.id}>
              <td>{i + 1}</td>
              <td>{official.namaLengkap}</td>
              <td>{official.jenisKelamin}</td>
              <td>{official.jabatan}</td>
              <td>{official.namaKontingen}</td>
              {!isEditOnly(eventId) &&
                (registered ? (
                  <TabelActionButtons
                    handleDelete={() => handleDelete(official)}
                    handleEdit={() => handleEdit(official)}
                    disabled={loading}
                  />
                ) : (
                  <UnregisteredPersonButtons
                    person={official}
                    personType="official"
                  />
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TabelOfficial;
