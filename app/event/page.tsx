import EventCard from "@/components/event/EventCard";
import EventSorter from "@/components/event/EventSorter";
import UnderConstruction from "@/components/utils/UnderConstruction";

const EventsPage = () => {
  return <UnderConstruction />;
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-1">EVENTS</h1>
      <EventSorter />
      <div className="flex flex-wrap gap-x-2">
        <EventCard id="portue-23" />
        <EventCard id="portue-23" />
      </div>
    </div>
  );
};
export default EventsPage;
