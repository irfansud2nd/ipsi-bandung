import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  let container: any[] = [];

  return getDocs(
    query(collection(firestore, "pal"), where("verified", "==", true))
  )
    .then((docSnapshot) => {
      if (docSnapshot.empty)
        return NextResponse.json(
          { message: "Data not found" },
          { status: 500 }
        );
      docSnapshot.forEach((doc) => {
        container.push(doc.data());
      });
      return NextResponse.json({ data: container }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
