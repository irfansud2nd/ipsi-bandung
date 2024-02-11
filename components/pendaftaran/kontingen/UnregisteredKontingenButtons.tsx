import useConfirmationRodal from "@/components/rodal/useConfirmationRodal";
import { addToEvent, updatePersons } from "@/utils/form/FormFunctions";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import {
  addKontingenToEvent,
  deleteKontingen,
} from "@/utils/form/kontingen/kontingenFunctions";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname } from "@/utils/shared/functions";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UnregisteredKontingenButtons = ({
  kontingen,
}: {
  kontingen: KontingenState;
}) => {
  const kontingenOfficials = useSelector(
    (state: RootState) => state.officials.all
  ).filter((official) => official.idKontingen == kontingen.id);
  const kontingenPesertas = useSelector(
    (state: RootState) => state.pesertas.all
  ).filter((peserta) => peserta.idKontingen == kontingen.id);

  const [loading, setLoading] = useState(false);

  const { confirm, ConfirmationRodal } = useConfirmationRodal();
  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();

  const toastId = useRef(null);

  const handleAdd = () => {
    setLoading(true);
    addKontingenToEvent(
      kontingen,
      confirm,
      kontingenOfficials,
      kontingenPesertas,
      toastId,
      dispatch,
      eventId,
      () => setLoading(false)
    ).finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    const result = await confirm(
      "Hapus Kontingen",
      `Apakah anda yakin akan menghapus kontingen ${kontingen.namaKontingen}`
    );
    if (result) {
      setLoading(true);
      deleteKontingen(
        kontingen,
        confirm,
        kontingenOfficials,
        kontingenPesertas,
        toastId,
        dispatch,
        eventId,
        () => setLoading(false)
      ).finally(() => setLoading(false));
    }
  };

  return (
    <td>
      <ConfirmationRodal />
      <div className="flex gap-1 text-sm px-1">
        <button className="btn_green" onClick={handleAdd} disabled={loading}>
          Tambahkan
        </button>
        <button className="btn_red" onClick={handleDelete} disabled={loading}>
          Hapus
        </button>
      </div>
    </td>
  );
};
export default UnregisteredKontingenButtons;
