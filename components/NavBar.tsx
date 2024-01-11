import Link from "next/link";

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
  ];
  return (
    <div className="flex justify-between items-center px-5 py-2">
      <Link href={"/"} className="font-extrabold text-2xl">
        IPSI KOTA BANDUNG
      </Link>
      <div className="flex gap-2 font-semibold text-lg">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default NavBar;