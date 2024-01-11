import Link from "next/link";

const EventCard = () => {
  return (
    <div className="border-black border-2 rounded-md p-2 flex gap-2 w-fit">
      <img
        src="/images/portue-2023.png"
        alt="logoPortue"
        className="h-[150px] w-fit border border-gray-400 rounded-md"
      />
      <div className="flex flex-col justify-between">
        <h2 className="text-xl font-bold">
          Portue Silat Bandung Championship 2023
        </h2>
        <div className="flex gap-3">
          <div>
            <p>Status</p>
            <p>Tanggal Pendaftaran</p>
            <p>Tanggal Penyelengaraan</p>
            <p>Tempat Penyelangaraan</p>
          </div>
          <div className="font-semibold">
            <p>Telah Selesai</p>
            <p>20 September 2023 - 20 November 2023</p>
            <p>23 November 2023 - 26 November 2023</p>
            <Link href="https://goo.gl/maps/CLbG5HzMxTNuxnoH7" target="_blank">
              Sport Jabar, Arcamanik, Kota Bandung
            </Link>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Link href="/event/portue-2023" target="_blank" className="btn_green">
            Halaman Event
          </Link>
          <button className="btn_green">Download Proposal</button>
          <Link
            href="/event/portue-2023/pendaftaran"
            target="_blank"
            className="btn_green"
          >
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
};
export default EventCard;
