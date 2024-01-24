import { firestore } from "@/utils/firebase/firebase";
import { PesertaState } from "@/utils/form/peserta/pesertaConstants";
import { FirestoreError, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { userId } = await req.json();
  console.log("GET REQUEST");
};

export const POST = async (req: Request) => {
  const { data }: { data: PesertaState } = await req.json();
  return setDoc(doc(firestore, "pesertas", data.id), data)
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
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
