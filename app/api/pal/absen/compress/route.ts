import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  deleteField,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const { email, compressedAbsen, month } = await req.json();
  return updateDoc(doc(firestore, "pal", email), {
    [`${month}-compressed`]: compressedAbsen,
    // [`${month}-hadir`]: deleteField(),
    // [`${month}-izin`]: deleteField(),
    // [`${month}-sakit`]: deleteField(),
    // [`${month}-alfa`]: deleteField(),
  })
    .then((res) => {
      return NextResponse.json(
        { message: "Compressed absen successfully sent" },
        { status: 200 }
      );
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
