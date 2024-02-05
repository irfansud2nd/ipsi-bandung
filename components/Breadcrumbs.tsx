"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Breadcrumbs = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {
      setPaths(pathname.split("/").filter((path) => path));
    }
  }, [pathname]);

  const renamePath = (path: string) => {
    switch (path) {
      case "pal":
        return "PAL";
      case "portue-23":
        return "PORTUE 2023";
      case "juaraumum":
        return "juara umum";
      default:
        return path;
    }
  };

  return (
    <div className="flex gap-1 items-center bg-white rounded-md px-1 font-semibold mb-1">
      <Link href="/" className={`${!paths.length && "font-bold"}`}>
        Home
      </Link>
      {paths.map((path, i) => (
        <div key={i} className="flex gap-1 items-center">
          {i != paths.length && <MdOutlineKeyboardArrowRight />}
          <Link
            href={`/${paths.slice(0, i + 1).join("/")}`}
            className={`${i == paths.length - 1 && "font-bold"} capitalize`}
          >
            {renamePath(path)}
          </Link>
        </div>
      ))}
    </div>
  );
};
export default Breadcrumbs;
