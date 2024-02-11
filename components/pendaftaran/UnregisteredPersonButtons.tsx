import { OfficialState } from "@/utils/form/official/officialConstants";
import { PesertaState } from "@/utils/form/peserta/pesertaConstants";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname } from "@/utils/shared/functions";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import useConfirmationRodal from "../rodal/useConfirmationRodal";
import { addPersonToEvent } from "@/utils/form/FormFunctions";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import { deleteOfficial } from "@/utils/form/official/officialFunctions";
import { deletePeserta } from "@/utils/form/peserta/pesertaFunctions";

type Props = {
  person: Person;
  personType: "official" | "peserta";
};

type Person = OfficialState | PesertaState;

const UnregisteredPersonButtons = ({ person, personType }: Props) => {
  const [loading, setLoading] = useState(false);

  const registeredKontingen = useSelector(
    (state: RootState) => state.kontingens.registered[0]
  );

  const kontingens = useSelector((state: RootState) => state.kontingens.all);

  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);

  const { confirm, ConfirmationRodal } = useConfirmationRodal();

  const handleAdd = async () => {
    if (person.idKontingen != registeredKontingen.id) {
      const result = await confirm(
        `Transfer ${personType}`,
        `${person.namaLengkap} tergabung di kontingen ${person.namaKontingen}, pindahkan ${person.namaLengkap} ke kontingen ${registeredKontingen.namaKontingen}?`
      );
      const oldKontingen = kontingens.find(
        (kontingen) => kontingen.id == person.id
      );
      result && addPerson(oldKontingen);
      return;
    }
    addPerson();
  };

  const addPerson = (oldKontingen?: KontingenState) => {
    setLoading(true);
    addPersonToEvent(
      person,
      eventId,
      toastId,
      dispatch,
      registeredKontingen,
      personType,
      oldKontingen
    ).finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    const result = await confirm(
      "hapus official",
      `Apakah anda yakin untuk menghapus ${person.namaLengkap} dari ${personType}?`
    );
    result && deletePerson();
  };

  const deletePerson = () => {
    const kontingen = kontingens.find(
      (kontingen) => kontingen.id == person.idKontingen
    );
    if (personType == "official") {
      deleteOfficial(
        person as OfficialState,
        dispatch,
        toastId,
        kontingen as KontingenState,
        true,
        eventId,
        () => setLoading(false)
      );
    } else {
      deletePeserta(
        person as PesertaState,
        dispatch,
        toastId,
        kontingen as KontingenState,
        true,
        eventId,
        () => setLoading(false)
      );
    }
  };

  return (
    <>
      <ConfirmationRodal />
      <div className="flex gap-1 text-sm px-1">
        <button className="btn_green" onClick={handleAdd} disabled={loading}>
          Tambahkan
        </button>
        <button className="btn_red" onClick={handleDelete} disabled={loading}>
          Hapus
        </button>
      </div>
    </>
  );
};
export default UnregisteredPersonButtons;
