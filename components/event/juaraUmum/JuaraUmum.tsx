import NotFound from "@/app/not-found";
import TabelJuara from "./TabelJuara";
import { juaraUmum } from "@/utils/data/juaraUmum";

export type KontingenScore = {
  idKontingen: string;
  namaKontingen: string;
  sdEmas: number;
  sdPerak: number;
  smpEmas: number;
  smpPerak: number;
  smpPerunggu: number;
  smaEmas: number;
  smaPerak: number;
  smaPerunggu: number;
  dewasaEmas: number;
  dewasaPerak: number;
  dewasaPerunggu: number;
};

export default function JuaraUmum({ eventId }: { eventId: string }) {
  const data: KontingenScore[] = juaraUmum[eventId];
  if (!data) return <NotFound />;
  return (
    <div>
      <h1 className="font-bold text-2xl">
        Rekapituasi Perolehan Medali Portue 2023
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <TabelJuara medalis={["sdEmas", "sdPerak"]} label="SD" rawData={data} />
        <TabelJuara
          medalis={["smpEmas", "smpPerak", "smpPerunggu"]}
          label="SMP"
          rawData={data}
        />
        <TabelJuara
          medalis={["smaEmas", "smaPerak", "smaPerunggu"]}
          label="SMA"
          rawData={data}
        />
        <TabelJuara
          medalis={["dewasaEmas", "dewasaPerak", "dewasaPerunggu"]}
          label="Dewasa"
          rawData={data}
        />
      </div>
    </div>
  );
}
