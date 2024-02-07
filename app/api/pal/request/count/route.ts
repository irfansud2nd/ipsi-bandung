import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  return getCountFromServer(
    query(collection(firestore, "pal"), where("verified", "==", false))
  )
    .then((snapshot) => {
      const count = snapshot.data().count;
      return NextResponse.json({ count }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
