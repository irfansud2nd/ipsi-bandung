import Accordion from "@/components/utils/Accordion";
import TabelKontingen from "./TabelKontingen";
import FormKontingen from "./FormKontingen";
import TabelKontingenLama from "./TabelKontingenLama";

const Kontingen = () => {
  return (
    <>
      <TabelKontingen />
      <Accordion title="Kontingen Baru" className="w-fit mb-1">
        <FormKontingen />
      </Accordion>
      <Accordion title="Kontingen Lama" className="w-fit">
        <TabelKontingenLama />
      </Accordion>
    </>
  );
};
export default Kontingen;
