import CountFirestore from "@/components/utils/CountFirestore";
import Link from "next/link";
const page = () => {
  return (
    <div>
      <h1 className="page_title">PAL</h1>
      <CountFirestore
        title="PAL Request"
        apiUrl="/api/pal/request/count"
        link="/admin/pal/request"
      />
      <Link href={"pal/absen"} className="btn_green">
        Absensi
      </Link>
    </div>
  );
};
export default page;
