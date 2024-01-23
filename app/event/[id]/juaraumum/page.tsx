import JuaraUmum from "@/components/event/juaraUmum/JuaraUmum";
import { events } from "@/utils/event/eventConstants";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const eventTitle =
    events[events.findIndex((event) => event.id == params.id)].title;
  return {
    title: `Rekapitulasi Perolehan Medali ${eventTitle}`,
    description: "Rekapitulasi Perolehan Medali - IPSI Kota Bandung",
  };
}

const page = ({ params }: { params: { id: string } }) => {
  return <JuaraUmum eventId={params.id} />;
};
export default page;
