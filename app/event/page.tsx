import EventCard from "@/components/event/EventCard";
import EventSorter from "@/components/event/EventSorter";
import UnderConstruction from "@/components/utils/UnderConstruction";

const EventsPage = () => {
  return <UnderConstruction />;
  return (
    <div>
      <h1 className="text-4xl font-extrabold">EVENTS</h1>
      <EventSorter />
      <EventCard />
    </div>
  );
};
export default EventsPage;
