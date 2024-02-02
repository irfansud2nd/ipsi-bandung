import { collection, doc } from "firebase/firestore";
import { PesertaState } from "./pesertaConstants";
import { firestore } from "@/utils/firebase/firebase";

export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

export const sendPeserta = (peserta: PesertaState) => {
  console.log("sending peserta");
  const newDocRef = doc(collection(firestore, "pesertas"));
  const id = newDocRef.id;
  const fotoUrl = `pesertas/pasFoto/${id}`;
  const kkUrl = `pesertas/kk/${id}`;
  const ktpUrl = `pesertas/ktp/${id}`;
  let downloadFotoUrl = "";
  let downloadKtpUrl = "";
  let donwloadKkUrl = "";
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        const pasFoto = new FormData();
        peserta.fotoFile && pasFoto.append("file", peserta.fotoFile);
        console.log("STEP 1");
        pasFoto.append("directory", fotoUrl);
        fetch("/api/files", {
          method: "POST",
          body: pasFoto,
        })
          .then((res) => res.json())
          .then((data) => {
            downloadFotoUrl = data.downloadUrl;
            stepController(2);
          })
          .catch((error) => console.log("ERROR", error));
        break;
      case 2:
        // SEND KTP
        const ktp = new FormData();
        peserta.ktpFile && ktp.append("file", peserta.ktpFile);
        console.log("STEP 2");
        ktp.append("directory", ktpUrl);
        fetch("/api/files", {
          method: "POST",
          body: ktp,
        })
          .then((res) => res.json())
          .then((data) => {
            donwloadKkUrl = data.downloadUrl;
            stepController(3);
          })
          .catch((error) => console.log("ERROR", error));
        break;
      case 3:
        // SEND KK
        const kk = new FormData();
        peserta.kkFile && kk.append("file", peserta.kkUrl);
        console.log("STEP 3");
        kk.append("directory", kkUrl);
        fetch("/api/files", {
          method: "POST",
          body: kk,
        })
          .then((res) => res.json())
          .then((data) => {
            donwloadKkUrl = data.downloadUrl;
            stepController(5);
          })
          .catch((error) => console.log("ERROR", error));
        break;
      case 4:
        // ADD PESERTA TO KONTINGEN
        break;
      case 5:
        // SEND PESERTA
        delete peserta.fotoFile;
        delete peserta.kkFile;
        delete peserta.ktpFile;
        console.log("STEP 5");
        fetch("/api/pesertas", {
          method: "POST",
          body: JSON.stringify({
            data: {
              ...peserta,
              id,
              fotoUrl,
              downloadFotoUrl,
              ktpUrl,
              downloadKtpUrl,
              kkUrl,
              donwloadKkUrl,
              waktuPendaftaran: Date.now(),
            },
          }),
        })
          .then((res) => {
            res.ok && console.log("OK");
            // toast complete
          })
          .catch((error) => console.log(error));
        break;
    }
  };
  stepController(1);
};
