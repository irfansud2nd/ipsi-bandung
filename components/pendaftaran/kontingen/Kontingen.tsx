import Accordion from "@/components/utils/Accordion";
import TabelKontingen from "./TabelKontingen";
import FormKontingen from "./FormKontingen";
import TabelKontingenLama from "./TabelKontingenLama";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import TabelOfficial from "../official/TabelOfficial";

const Kontingen = () => {
  const registeredKontingens = useSelector(
    (state: RootState) => state.kontingens.registered
  );
  return (
    <div>
      <TabelKontingen registered />
      {/* {registeredKontingens.length ? (
        <p className="text-yellow-600">
          1 akun hanya diperbolehkan mendaftarkan 1 kontingen per event
        </p>
      ) : ( */}
      <Accordion title="Kontingen Baru" className="w-fit mb-1">
        <FormKontingen />
      </Accordion>
      {/* )} */}
      <Accordion title="Kontingen Lama" className="w-fit">
        <TabelKontingen />
      </Accordion>
    </div>
  );
};
export default Kontingen;
