import Accordion from "@/components/utils/Accordion";
import FormOfficial from "./FormOfficial";
import TabelOfficialLama from "./TabelOfficialLama";
import TabelOfficial from "./TabelOfficial";

const Official = () => {
  return (
    <div>
      <TabelOfficial registered />
      <Accordion title="Official Baru" className="w-fit mb-1">
        <FormOfficial />
      </Accordion>
      <Accordion title="Official Lama" className="w-fit">
        <TabelOfficial />
      </Accordion>
    </div>
  );
};
export default Official;
