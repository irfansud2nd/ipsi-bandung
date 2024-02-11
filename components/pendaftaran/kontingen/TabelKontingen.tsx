import TabelActionButtons from "@/components/TabelActionButtons";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname, isEditOnly } from "@/utils/shared/functions";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import UnregisteredKontingenButtons from "./UnregisteredKontingenButtons";
import { deleteKontingenFromEvent } from "@/utils/form/kontingen/kontingenFunctions";
import useConfirmationRodal from "@/components/rodal/useConfirmationRodal";
import { setKontingenToEditRedux } from "@/utils/redux/kontingens/kontingensSlice";

type Props = {
  registered?: boolean;
};

const TabelKontingen = ({ registered }: Props) => {
  const [loading, setLoading] = useState(false);

  const registeredKontingens = useSelector(
    (state: RootState) => state.kontingens.registered
  );
  const unregisteredKontingens = useSelector(
    (state: RootState) => state.kontingens.unregistered
  );

  const toastId = useRef(null);
  const dispatch = useDispatch();
  const eventId = getEventIdByPathname(usePathname());
  const { confirm, ConfirmationRodal } = useConfirmationRodal();

  const registeredOfficials = useSelector(
    (state: RootState) => state.officials.registered
  );
  const registeredPesertas = useSelector(
    (state: RootState) => state.pesertas.registered
  );

  const allOfficials = useSelector((state: RootState) => state.officials.all);
  const allPesertas = useSelector((state: RootState) => state.pesertas.all);

  // DELETE FROM EVENT
  const handleDelete = async (kontingen: KontingenState) => {
    let message = "";
    if (registeredPesertas.length || registeredOfficials.length) {
      registeredOfficials.length &&
        (message += registeredOfficials.length + " official, ");
      registeredPesertas.length &&
        (message += registeredPesertas.length + " peserta, ");
      message += "akan ikut terhapus dari event ini. ";
    }
    message += "Apakah anda yakin untuk menghapus kontingen dari event ini?";

    const result = await confirm("Hapus Kontingen dari event", message);
    if (!result) return;

    const kontingenOfficials = allOfficials.filter(
      (official) => official.idKontingen == kontingen.id
    );
    const kontingenPesertas = allPesertas.filter(
      (peserta) => peserta.idKontingen == kontingen.id
    );

    deleteKontingenFromEvent(
      kontingen,
      registeredOfficials,
      registeredPesertas,
      kontingenOfficials,
      kontingenPesertas,
      eventId,
      dispatch,
      toastId,
      () => setLoading(false)
    ).finally(() => setLoading(false));
  };

  // EDIT KONTINGEN
  const handleEdit = (kontingen: KontingenState) => {
    dispatch(setKontingenToEditRedux(kontingen));
  };

  const kontingensToMap = registered
    ? registeredKontingens
    : unregisteredKontingens;

  if (!registeredKontingens.length && registered)
    return (
      <p className="text-red-500">
        Belum ada kontingen terdaftar untuk event ini
      </p>
    );

  if (!unregisteredKontingens.length && !registered)
    return (
      <p className="text-red-500">
        Tidak ada Kontingen yang belum di daftarkan ke event ini
      </p>
    );

  return (
    <>
      <ConfirmationRodal />
      <table className="mb-1 w-fit h-fit">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Jumlah Official</th>
            <th>Jumlah Peserta</th>
            {!isEditOnly(eventId) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {kontingensToMap.map((kontingen, i) => (
            <tr key={kontingen.id}>
              <td>{i + 1}</td>
              <td>{kontingen.namaKontingen}</td>
              <td>{kontingen.officials.length}</td>
              <td>{kontingen.pesertas.length}</td>
              {!isEditOnly(eventId) &&
                (registered ? (
                  <TabelActionButtons
                    handleDelete={() => handleDelete(kontingen)}
                    handleEdit={() => handleEdit(kontingen)}
                    disabled={loading}
                  />
                ) : (
                  <UnregisteredKontingenButtons kontingen={kontingen} />
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TabelKontingen;
