import JuaraUmum from "@/components/event/juaraUmum/JuaraUmum";

const page = ({ params }: { params: { id: string } }) => {
  return <JuaraUmum eventId={params.id} />;
};
export default page;
