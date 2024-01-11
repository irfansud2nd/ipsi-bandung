import { firestore } from "@/utils/firebase/firebase";
import { OfficialState } from "@/utils/form/official/officialConstants";
import { FirestoreError, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { data }: { data: OfficialState } = await req.json();
  return setDoc(doc(firestore, "officals", data.id), data)
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
