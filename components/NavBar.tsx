import Link from "next/link";
import ProfileButton from "./navbar/ProfileButton";
import NavMenu from "./navbar/NavMenu";

const NavBar = () => {
  const links = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Event",
      href: "/event",
    },
    {
      label: "PAL",
      href: "/pal",
    },
  ];
  return (
    <div className="flex justify-between items-center px-3 py-2">
      <div className="flex items-center">
        <NavMenu links={links} />
        <Link href={"/"} className="font-extrabold text-2xl">
          IPSI KOTA BANDUNG
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <div className="gap-2 font-semibold text-lg hidden sm:flex">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <ProfileButton />
      </div>
    </div>
  );
};
export default NavBar;
