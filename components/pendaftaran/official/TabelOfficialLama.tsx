import useConfirmationRodal from "@/components/rodal/useConfirmationRodal";
import { OfficialState } from "@/utils/form/official/officialConstants";
import { RootState } from "@/utils/redux/store";
import { getEventIdByPathname, isEditOnly } from "@/utils/shared/functions";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TabelOfficialLama = () => {
  const [loading, setLoading] = useState(false);
  const [rodalVisible, setRodalVisible] = useState(false);

  const officials = useSelector(
    (state: RootState) => state.officials.unregistered
  );

  const registeredKontingen = useSelector(
    (state: RootState) => state.kontingens.registered[0]
  );

  const eventId = getEventIdByPathname(usePathname());
  const dispatch = useDispatch();
  const toastId = useRef(null);

  const { confirm, ConfirmationRodal } = useConfirmationRodal();

  const handleAdd = async (official: any) => {
    // console.log(isOfType(official, OfficialState));
    if (official.idKontingen != registeredKontingen.id) {
      const result = await confirm(
        "Transfer Official",
        `Official ${official.namaLengkap} tergabung di kontingen ${official.namaKontingen}, pindahkan official ke kontingen ${registeredKontingen.namaKontingen}?`
      );
      result && addOfficial(official);
      return;
    }
    addOfficial(official);
  };

  const addOfficial = (official: OfficialState) => {
    // setLoading(true);
    // addOfficialToEvent(
    //   official,
    //   eventId,
    //   toastId,
    //   dispatch,
    //   registeredKontingen
    // ).finally(() => setLoading(false));
  };

  if (!officials.length)
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
          {officials.map((official, i) => (
            <tr key={official.id}>
              <td>{i + 1}</td>
              <td>{official.namaLengkap}</td>
              <td>{official.jenisKelamin}</td>
              <td>{official.jabatan}</td>
              <td>{official.namaKontingen}</td>
              <td>
                <button
                  className="btn_green my-1"
                  onClick={() => handleAdd(official)}
                  disabled={loading}
                >
                  Tambahkan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TabelOfficialLama;
