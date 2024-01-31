import AbsenAdmin from "@/components/admin/pal/AbsenAdmin";

const page = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="page_title">Absensi Atlet PAL</h1>
      <AbsenAdmin />
    </div>
  );
};
export default page;
