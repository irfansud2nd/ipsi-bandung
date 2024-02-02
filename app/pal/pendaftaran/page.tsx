"use client";
import IsAuthorized from "@/components/auth/IsAuthorized";
import FormPal from "@/components/pendaftaran/pal/FormPal";
import CenterBoxShadow from "@/components/utils/CenterBoxShadow";
const page = () => {
  return (
    <IsAuthorized access="palReverse">
      <CenterBoxShadow>
        <FormPal />
      </CenterBoxShadow>
    </IsAuthorized>
  );
};
export default page;
