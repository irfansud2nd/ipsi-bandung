"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import Accordion from "../utils/Accordion";
import { adminMenus } from "@/utils/admin/AdminConstants";
import { usePathname } from "next/navigation";
import { isAdmin } from "@/utils/admin/AdminFunctions";
import { getServerSession } from "next-auth";

type Props = {
  links: {
    href: string;
    label: string;
  }[];
};

const NavMenu = ({ links }: Props) => {
  const [show, setShow] = useState(false);
  const [onAdmin, setOnAdmin] = useState(false);

  const pathanames = usePathname().split("/");

  useEffect(() => {
    setOnAdmin(pathanames.indexOf("admin") >= 0);
  }, [pathanames]);

  return (
    <div className="sm:hidden -translate-x-2 z-10">
      <button onClick={() => setShow((prev) => !prev)}>
        <IoMenu className="text-2xl mt-1 border border-gray-300 rounded-md" />
      </button>
      <div
        className={`bg-gray-50 border-gray-200 absolute z-10 left-0 w-screen -translate-x-3 flex flex-col items-start gap-1 font-normal text-base rounded-md shadow-lg transition-all overflow-hidden
        ${show ? "max-h-[1000px] p-1 border-2" : "max-h-0"}`}
      >
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setShow(false)}>
            {link.label}
          </Link>
        ))}
        {onAdmin && (
          <Accordion
            title="Admin"
            className="w-full border-none px-0"
            hideOn={!show}
            arrowOnLeft
          >
            <div className="flex flex-col pl-2">
              {adminMenus.map((menu) => (
                <>
                  {menu.child ? (
                    <Accordion
                      title={menu.label}
                      className="w-full border-none px-0"
                      hideOn={!show}
                      key={menu.href}
                      arrowOnLeft
                    >
                      <div
                        className="flex flex-col pl-2"
                        onClick={() => setShow(false)}
                      >
                        <Link href={menu.href}>Home</Link>
                        {menu.child.map((item) => (
                          <Link href={item.href} key={item.href}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </Accordion>
                  ) : (
                    <Link
                      href={menu.href}
                      key={menu.href}
                      onClick={() => setShow(false)}
                    >
                      {menu.label}
                    </Link>
                  )}
                </>
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
};
export default NavMenu;
