import UnderConstruction from "@/components/utils/UnderConstruction";

const page = ({ params }: { params: { id: string } }) => {
  return <UnderConstruction />;
  return <div>Event ID: {params.id}</div>;
};
export default page;
