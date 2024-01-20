import { firestore } from "@/utils/firebase/firebase";
import { KontingenState } from "@/utils/form/kontingen/kontingenConstants";
import { FirestoreError, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { data }: { data: KontingenState } = await req.json();
  return setDoc(doc(firestore, "kontingens", data.id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: "Data berhasil dikirimkan",
        },
        {
          status: 200,
        }
      );
    })
    .catch((err: FirestoreError) => {
      return NextResponse.json(
        { message: err.message, code: err.code },
        { status: 500 }
      );
    });
};
