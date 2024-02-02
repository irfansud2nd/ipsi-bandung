import { firestore } from "@/utils/firebase/firebase";
import { FirestoreError, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: Request) => {
  const { email } = await req.json();
  const today = new Date();
  const id = `${today.getMonth() + 1}-${today.getFullYear()}`;
  const dayId = `${today.getDate()}-${id}`;

  const data = {
    [dayId]: arrayUnion(email),
  };

  return updateDoc(doc(firestore, "absen-pal", id), data)
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
