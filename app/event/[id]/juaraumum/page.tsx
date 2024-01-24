import JuaraUmum from "@/components/event/juaraUmum/JuaraUmum";
import { events } from "@/utils/event/eventConstants";
import { getEventTitle } from "@/utils/shared/functions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Rekapitulasi Perolehan Medali ${getEventTitle(params.id)}`,
    description: "Rekapitulasi Perolehan Medali - IPSI Kota Bandung",
  };
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <h1 className="page_title">
        Rekapituasi Perolehan Medali - {getEventTitle(params.id)}
      </h1>
      <JuaraUmum eventId={params.id} />
    </>
  );
};
export default page;
