import Pendaftaran from "@/components/pendaftaran/Pendaftaran";
import { getEventTitle } from "@/utils/shared/functions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Halaman Pendaftaran ${getEventTitle(params.id)}`,
    description: "Rekapitulasi Perolehan Medali - IPSI Kota Bandung",
  };
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="w-full h-full">
      <h1 className="page_title">
        Halaman Pendaftaran - {getEventTitle(params.id)}
      </h1>
      <Pendaftaran />
    </div>
  );
};

export default page;
