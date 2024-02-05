import { firestore } from "@/utils/firebase/firebase";
import { FirestoreError, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const email = params.email;

  return deleteDoc(doc(firestore, "pal", email))
    .then((res) => {
      return NextResponse.json(
        { message: "Request successfully deleted" },
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
