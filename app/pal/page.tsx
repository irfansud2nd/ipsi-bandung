import IsAuthorized from "@/components/auth/IsAuthorized";
import Link from "next/link";

const page = () => {
  return (
    <IsAuthorized access="pal">
      <h1 className="page_title">PAL</h1>
      <Link href="/pal/absen" className="btn_green">
        Absensi
      </Link>
    </IsAuthorized>
  );
};
export default page;
