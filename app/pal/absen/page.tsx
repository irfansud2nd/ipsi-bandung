import AbsenPal from "@/components/pal/absen/AbsenPal";
import IsLoggedIn from "@/components/auth/IsLoggedIn";
import IsAuthorized from "@/components/auth/IsAuthorized";

const page = () => {
  return (
    <IsAuthorized access="pal">
      <AbsenPal />
    </IsAuthorized>
  );
};
export default page;
