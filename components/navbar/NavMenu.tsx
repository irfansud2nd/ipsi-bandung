"use client";
import Link from "next/link";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

type Props = {
  links: {
    href: string;
    label: string;
  }[];
};

const NavMenu = ({ links }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative sm:hidden -translate-x-2">
      <button onClick={() => setShow((prev) => !prev)}>
        <IoMenu className="text-2xl mt-1 border border-gray-300 rounded-md" />
      </button>
      <div
        className={`bg-gray-50 border-gray-200 absolute z-10 left-0 flex flex-col items-start gap-1 font-normal text-base rounded-md shadow-lg transition-all overflow-hidden
        ${show ? "max-h-[1000px] p-1 border-2" : "max-h-0"}`}
      >
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setShow(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default NavMenu;
