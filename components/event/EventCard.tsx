import { events } from "@/utils/event/eventConstants";
import { generateTanggal } from "@/utils/shared/functions";
import Link from "next/link";
import EventCardMenu from "./EventCardMenu";
import DownloadProposal from "./eventCard/DownloadProposal";

const EventCard = ({ id }: { id: string }) => {
  const event = events[events.findIndex((event) => event.id == id)];
  const getStatus = (status: string) => {
    switch (status) {
      case "ended":
        return "Telah Selesai";
      case "upcoming":
        return "Akan datang";
      case "open register":
        return "Masa Pendaftaran";
      case "upcoming":
        return "Pendaftaran ditutup";
    }
  };
  return (
    <div className="border-black border-2 rounded-md p-2 w-fit mb-1">
      <div className="flex justify-between">
        <Link href={`/event/${id}`}>
          <h2 className="text-xl font-bold mb-1">{event.title}</h2>
        </Link>
        <EventCardMenu id={id} />
      </div>
      <div className="flex gap-2">
        <Link href={`/event/${id}`}>
          <img
            src="/images/portue-2023.png"
            alt="logoPortue"
            className="h-fit min-w-[150px] w-[150px]"
          />
        </Link>
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 whitespace-nowrap">
            <div>
              <p>Status</p>
              <p>Tanggal Pendaftaran</p>
              <p>Tanggal Pelaksanaan</p>
              <p>Lokasi</p>
              <p>Peserta Terdaftar</p>
            </div>
            <div className="font-semibold">
              <p>{getStatus(event.status)}</p>
              <div className="flex gap-1">
                <div>
                  <p>{generateTanggal(event.registerDate.start)}</p>
                  <p>{generateTanggal(event.eventDate.start)}</p>
                </div>
                <div>
                  <p>-</p>
                  <p>-</p>
                </div>
                <div>
                  <p>{generateTanggal(event.registerDate.end)}</p>
                  <p>{generateTanggal(event.eventDate.end)}</p>
                </div>
              </div>
              <Link
                href={event.location.link}
                target="_blank"
                className="hover:border-b hover:text-green-500 border-b-green-500 transition"
              >
                {event.location.name}
              </Link>
              <p>{event.registeredPesertas} Orang</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {event.status != "ended" && <DownloadProposal id={id} />}
            {(event.status == "open register" ||
              event.status == "close register") && (
              <Link href="/event/portue-23/pendaftaran" className="btn_green">
                {event.status == "open register" && "Daftar"}
                {event.status == "close register" && "Edit data"}
              </Link>
            )}
            {event.championLink && (
              <Link href="/event/portue-23/juaraumum" className="btn_green">
                Rekapitulasi Perolehan Medali
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventCard;
