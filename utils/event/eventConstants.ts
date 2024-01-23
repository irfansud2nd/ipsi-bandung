type Event = {
  id: string;
  title: string;
  status: "ended" | "upcoming" | "open register" | "close register";
  eventDate: {
    start: string;
    end: string;
  };
  registerDate: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    link: string;
  };
  registerLink: string;
  championLink?: boolean;
  registeredPesertas: "dynamic" | number;
  editOnly: boolean;
};

export const events: Event[] = [
  {
    id: "portue-23",
    title: "PORTUE Silat Bandung Championship 2023",
    status: "ended",
    eventDate: {
      start: "2023-11-23",
      end: "2023-11-26",
    },
    registerDate: {
      start: "2023-9-20",
      end: "2023-11-23",
    },
    location: {
      link: "https://goo.gl/maps/CLbG5HzMxTNuxnoH7",
      name: "Sport Jabar, Arcamanik, Kota Bandung",
    },
    registerLink: "/event/portue-2023",
    registeredPesertas: 1700,
    championLink: true,
    editOnly: false,
  },
];
