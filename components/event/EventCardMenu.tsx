"use client";
import { useState } from "react";
import { IoMdMore } from "react-icons/io";

const EventCardMenu = ({ id }: { id: string }) => {
  const [show, setShow] = useState(false);
  return (
    <button className="hover:bg-gray-200 transition-all rounded-full px-1">
      <IoMdMore className="text-2xl" />
    </button>
  );
};
export default EventCardMenu;
