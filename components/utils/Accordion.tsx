"use client";

import { useState, useEffect } from "react";
import { RiArrowDownSFill } from "react-icons/ri";

type Props = {
  className?: string;
  title: string;
  children: React.ReactNode;
  hideOn?: boolean;
  showOn?: boolean;
  arrowOnLeft?: boolean;
};

const Accordion = ({
  className,
  title,
  children,
  hideOn,
  showOn,
  arrowOnLeft,
}: Props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hideOn) setShow(false);
  }, [hideOn]);

  return (
    <div className={`border border-black rounded-md p-1 ${className}`}>
      <button
        className={`w-full text-start flex items-center
        ${!arrowOnLeft && "justify-between"}`}
        onClick={() => setShow((prev) => !prev)}
        onDoubleClick={() => console.log(title)}
      >
        {arrowOnLeft && (
          <RiArrowDownSFill
            className={`${!show && "-rotate-90"} transition-all duration-500`}
          />
        )}
        <span>{title}</span>
        {!arrowOnLeft && (
          <RiArrowDownSFill
            className={`${show && "rotate-180"} transition-all duration-500`}
          />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all h-fit duration-500 pt-1
        ${show ? "max-h-[2000px] border-t border-black" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
};
export default Accordion;
