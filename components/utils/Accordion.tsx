"use client";

import { useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";

type Props = {
  className?: string;
  title: string;
  children: React.ReactNode;
};
const Accordion = ({ className, title, children }: Props) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border border-black rounded-md p-1 ${className}`}>
      <button
        className="w-full text-start flex justify-between items-center"
        onClick={() => setShow((prev) => !prev)}
      >
        <span>{title}</span>
        <RiArrowDownSFill
          className={`${show && "rotate-180"} transition-all duration-500`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all h-fit duration-500
        ${show ? "max-h-[1000px] border-t border-black" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
};
export default Accordion;
