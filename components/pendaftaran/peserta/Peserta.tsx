import Accordion from "@/components/utils/Accordion";
import TabelPeserta from "./TabelPeserta";
import FormPeserta from "./FormPeserta";
import TabelPesertaLama from "./TabelPesertaLama";

const Peserta = () => {
  return (
    <div>
      <TabelPeserta registered />
      <Accordion title="Peserta Baru" className="w-fit mb-1">
        <FormPeserta />
      </Accordion>
      <Accordion title="Peserta Lama" className="w-fit">
        <TabelPesertaLama />
      </Accordion>
    </div>
  );
};
export default Peserta;
