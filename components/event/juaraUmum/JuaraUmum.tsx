import { compare } from "@/utils/shared/functions";
import { promises as fs } from "fs";
import TabelJuara from "./TabelJuara";
import { date } from "yup";

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

export default async function JuaraUmum({ eventId }: { eventId: string }) {
  const file = await fs.readFile(
    process.cwd() + "/utils/data/juaraUmum.json",
    "utf8"
  );
  const data: KontingenScore[] = JSON.parse(file).juaraUmum[eventId];
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
