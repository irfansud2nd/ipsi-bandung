import { firestore } from "@/utils/firebase/firebase";
import { getToday } from "@/utils/pal/absen/PalAbsenFunctions";
import {
  FirestoreError,
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const { email, tipe, month, day } = await req.json();
  const thisMonth = month || getToday("month+year");
  const todayDate = day || getToday("day");

  const data = {
    [`${thisMonth}-hadir`]: arrayRemove(todayDate),
    [`${thisMonth}-izin`]: arrayRemove(todayDate),
    [`${thisMonth}-sakit`]: arrayRemove(todayDate),
    [`${thisMonth}-alfa`]: arrayRemove(todayDate),
    [`${thisMonth}-${tipe}`]: arrayUnion(todayDate),
  };

  return updateDoc(doc(firestore, "pal", email), data)
    .then(() => {
      return NextResponse.json(
        {
          message: "Absen sent",
        },
        {
          status: 200,
        }
      );
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
