import JuaraUmum from "@/components/event/juaraUmum/JuaraUmum";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <JuaraUmum eventId={params.id} />
    </div>
  );
};
export default page;
