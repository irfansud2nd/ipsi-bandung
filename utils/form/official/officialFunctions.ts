import { collection, doc } from "firebase/firestore";
import { OfficialState } from "./officialConstants";
import { firestore } from "@/utils/firebase/firebase";

export const sendOfficial = (official: OfficialState) => {
  const newDocRef = doc(collection(firestore, "officials"));
  const id = newDocRef.id;
  const fotoUrl = `officials/pasFoto/${id}`;
  let downloadFotoUrl = "";
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        const pasFoto = new FormData();
        official.fotoFile && pasFoto.append("file", official.fotoFile);
        pasFoto.append("directory", fotoUrl);
        fetch("/api/files", {
          method: "POST",
          body: pasFoto,
        })
          .then((res) => res.json())
          .then((data) => {
            downloadFotoUrl = data.downloadUrl;
            stepController(3);
          })
          .catch((error) => console.log("ERROR", error));
        break;
      case 2:
        // ADD OFFICIAL TO KONTINGEN
        break;
      case 3:
        delete official.fotoFile;
        fetch("/api/officials", {
          method: "POST",
          body: JSON.stringify({
            data: {
              ...official,
              id,
              fotoUrl,
              downloadFotoUrl,
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
