type Event = {
  name: string;
  status: "ended" | "upcoming" | "open register" | "close register";
  eventDate: {
    start: Date;
    end: Date;
  };
  registerDate: {
    start: Date;
    end: Date;
  };
  registerLink: string;
  championLink?: string;
  registeredPesertas?: number;
};

export const events: Event[] = [
  {
    name: "Portue Silat Bandung Championship 2023",
    status: "ended",
    eventDate: {
      start: new Date("2023-23-10"),
      end: new Date("2023-26-10"),
    },
    registerDate: {
      start: new Date(),
      end: new Date(),
    },
    registerLink: "/event/portue-2023",
  },
];
