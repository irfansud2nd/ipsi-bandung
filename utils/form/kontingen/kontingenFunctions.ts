import { collection, doc } from "firebase/firestore";
import { KontingenState } from "./kontingenConstants";
import { firestore } from "@/utils/firebase/firebase";

export const sendKontingen = (kontingen: KontingenState) => {
  const newDocRef = doc(collection(firestore, "kontingens"));
  const id = newDocRef.id;

  fetch("/api/kontingens", {
    method: "POST",
    body: JSON.stringify({
      data: {
        ...kontingen,
        id,
        waktuPendaftaran: Date.now(),
      },
    }),
  })
    .then((res) => {
      res.ok && console.log("OK");
    })
    .catch((error) => console.log(error));
};
