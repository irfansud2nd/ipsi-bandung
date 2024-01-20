"use client";
import { Provider } from "react-redux";
import EventSorterButton from "./EventSorterButton";
import { store } from "@/utils/redux/store";

const EventSorter = () => {
  return (
    <Provider store={store}>
      <div className="flex gap-2">
        <EventSorterButton label="Newest" value="newest" />
        <EventSorterButton label="Upcoming" value="upcoming" />
      </div>
    </Provider>
  );
};
export default EventSorter;
