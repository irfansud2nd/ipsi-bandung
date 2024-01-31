import AbsenPal from "@/components/pal/absen/AbsenPal";
import IsLoggedIn from "@/components/utils/IsLoggedIn";
import { useSession } from "next-auth/react";

const page = () => {
  return (
    <IsLoggedIn>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="page_title">Absensi Atlet PAL</h1>
        <AbsenPal />
      </div>
    </IsLoggedIn>
  );
};
export default page;
