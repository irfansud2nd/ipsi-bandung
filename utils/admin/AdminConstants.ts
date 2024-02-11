export const adminMenus = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "PAL",
    href: "/admin/pal",
    child: [
      {
        label: "Absen",
        href: "/admin/pal/absen",
      },
      {
        label: "Rekap & Absen Manual",
        href: "/admin/pal/absen/rekap",
      },
    ],
  },
];
