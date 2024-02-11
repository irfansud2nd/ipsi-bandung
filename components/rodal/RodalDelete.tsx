import Rodal from "rodal";
import "rodal/lib/rodal.css";

type Props = {
  visible: boolean;
  dataToDelete: any;
  cancelDelete: () => void;
  deleteData: () => void;
  tipe: "kontingen" | "peserta" | "official";
  inEvent?: boolean;
};
const RodalDelete = ({
  visible,
  dataToDelete,
  cancelDelete,
  deleteData,
  tipe,
  inEvent,
}: Props) => {
  return (
    <Rodal visible={visible} onClose={cancelDelete}>
      <div className="w-full h-full flex flex-col justify-between">
        <h1 className="font-semibold uppercase text-red-500">Hapus {tipe}</h1>
        {dataToDelete.idPembayaran?.length ? (
          <p className="text-center">
            <span className="font-semibold text-red-500">
              Tidak dapat menghapus {tipe} dari event ini
            </span>
            <br />
            Maaf, {tipe} yang sudah diselesaikan pembayarannya tidak dapat
            dihapus event ini
          </p>
        ) : (
          <p>
            {tipe == "kontingen" &&
              (dataToDelete.officials.length !== 0 ||
                dataToDelete.pesertas.length !== 0) && (
                <span>
                  jika anda memilih untuk menghapus kontingen ini
                  {inEvent && " dari event ini"},{" "}
                  <b>{dataToDelete.officials.length} Official</b> dan{" "}
                  <b>{dataToDelete.pesertas.length} Peserta </b> yang tergabung
                  di dalam kontingen {dataToDelete.namaKontingen} akan ikut
                  terhapus
                  {inEvent && " dari event ini"}.
                  <br />
                </span>
              )}
            Apakah anda yakin akan menghapus {tipe}{" "}
            {inEvent && "dari event ini"}?
          </p>
        )}
        <div className="self-end flex gap-2">
          {!dataToDelete.idPembayaran?.length && (
            <button
              className="btn_red btn_full"
              onClick={deleteData}
              type="button"
            >
              Yakin
            </button>
          )}
          <button
            className="btn_green btn_full"
            onClick={cancelDelete}
            type="button"
          >
            Batal
          </button>
        </div>
      </div>
    </Rodal>
  );
};
export default RodalDelete;
