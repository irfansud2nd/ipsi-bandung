import { firestore } from "@/utils/firebase/firebase";
import { PalState } from "@/utils/form/pal/palConstants";
import {
  FirestoreError,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  let container: any[] = [];
  return getDocs(
    query(collection(firestore, "pal"), where("verified", "==", false))
  )
    .then((res) => {
      if (res.empty) {
        return NextResponse.json(
          { message: "Data not found" },
          { status: 500 }
        );
      } else {
        res.forEach((doc) => container.push(doc.data()));
        return NextResponse.json({ data: container }, { status: 200 });
      }
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};

export const POST = async (req: Request) => {
  const data = await req.json();

  return setDoc(doc(firestore, "pal", data.id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: "Request succesfully sent",
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

export const PATCH = async (req: Request) => {
  const { id } = await req.json();

  return updateDoc(doc(firestore, "pal", id), {
    verified: true,
  })
    .then((res) => {
      return NextResponse.json(
        { message: "PAL account succesfully verified" },
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
