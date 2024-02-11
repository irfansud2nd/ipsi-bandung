import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname, isEditOnly } from "@/utils/shared/functions";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import TabelActionButtons from "@/components/TabelActionButtons";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import useConfirmationRodal from "@/components/rodal/useConfirmationRodal";
import { PesertaState } from "@/utils/form/peserta/pesertaConstants";
import UnregisteredPersonButtons from "../UnregisteredPersonButtons";
import { deletePersonFromEvent } from "@/utils/form/FormFunctions";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import { setPesertaToEditRedux } from "@/utils/redux/pesertas/pesertasSlice";

type Props = {
  registered?: boolean;
};

const TabelPeserta = ({ registered }: Props) => {
  const registeredPesertas = useSelector(
    (state: RootState) => state.pesertas.registered
  );
  const unregisteredPesertas = useSelector(
    (state: RootState) => state.pesertas.unregistered
  );
  const allKontingens = useSelector((state: RootState) => state.kontingens.all);

  const [loading, setLoading] = useState(false);
  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);
  const { confirm, ConfirmationRodal } = useConfirmationRodal();

  // DELETE FROM EVENT
  const handleDelete = async (peserta: PesertaState) => {
    const result = await confirm(
      "hapus peserta dari event",
      `Apakah anda yakin untuk menghapus ${peserta.namaLengkap} dari event ini?`
    );
    if (!result) {
      return;
    }
    setLoading(true);
    const kontingen = allKontingens.find(
      (kontingen) => kontingen.id == peserta.idKontingen
    );
    deletePersonFromEvent(
      peserta,
      "peserta",
      kontingen as KontingenState,
      eventId,
      toastId,
      dispatch,
      () => setLoading(false)
    );
  };

  // EDIT PESERTA
  const handleEdit = (peserta: PesertaState) => {
    dispatch(setPesertaToEditRedux(peserta));
  };

  const pesertasToMap = registered ? registeredPesertas : unregisteredPesertas;

  if (!registeredPesertas.length && registered)
    return (
      <p className="text-red-500">
        Belum ada peserta terdaftar untuk event ini
      </p>
    );

  if (!unregisteredPesertas.length && !registered)
    return (
      <p className="text-red-500">
        Tidak ada peserta yang belum di daftarkan ke event ini
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
          {pesertasToMap.map((peserta, i) => (
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
              {!isEditOnly(eventId) &&
                (registered ? (
                  <TabelActionButtons
                    handleDelete={() => handleDelete(peserta)}
                    handleEdit={() => handleEdit(peserta)}
                    disabled={loading}
                  />
                ) : (
                  <UnregisteredPersonButtons
                    person={peserta}
                    personType="peserta"
                  />
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TabelPeserta;
