"use client";
import { useState, useEffect } from "react";
import { RiArrowLeftCircleFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenus } from "@/utils/admin/AdminConstants";

const SideMenu = () => {
  const [show, setShow] = useState(true);
  const [activeDir, setActiveDir] = useState("dashboard");

  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split("/");
    setActiveDir(path[2] || "dashboard");
  }, [pathname]);

  return (
    <nav className="hidden sm:block bg-gray-900 text-white px-2 py-1 -translate-x-2 rounded-tr-md">
      <div className="sticky top-0">
        <div
          className={`flex justify-between items-center pb-1 ${
            show && "gap-x-2 border-b-2 border-white"
          }`}
        >
          <h1
            className={`font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all ${
              show ? "max-w-[200px]" : "max-w-0"
            }`}
          >
            Admin Menu
          </h1>
          <button onClick={() => setShow((prev) => !prev)}>
            <RiArrowLeftCircleFill
              className={`text-2xl ${!show && "rotate-180"} transition-all`}
            />
          </button>
        </div>
        <div
          className={`flex flex-col items-center whitespace-nowrap overflow-hidden transition-all mt-1 ${
            show ? "max-w-[200px]" : "max-w-0"
          }`}
        >
          {adminMenus.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className={`font-semibold w-full text-center ${
                activeDir.toLowerCase() == menu.label.toLowerCase() &&
                "bg-white text-gray-900 rounded-sm"
              }`}
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default SideMenu;
