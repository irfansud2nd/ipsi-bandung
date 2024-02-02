import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const today = new Date();
const id = `${today.getMonth() + 1}-${today.getFullYear()}`;
const dayId = `${today.getDate()}-${id}`;

export const POST = async (req: Request) => {
  const { token } = await req.json();

  const data = {
    [`token-${dayId}`]: token,
    [`token-${dayId}-status`]: true,
  };

  return setDoc(doc(firestore, "absen-pal", id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: "Token sent",
          token,
          status: true,
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

export const GET = async (req: Request) => {
  return getDoc(doc(firestore, "absen-pal", id))
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return NextResponse.json(
          {
            token: data[`token-${dayId}`],
            message: "Token already exist",
            status: data[`token-${dayId}-status`],
          },
          {
            status: 200,
          }
        );
      }
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};

export const PATCH = async (req: Request) => {
  const { status } = await req.json();

  const data = {
    [`token-${dayId}-status`]: status,
  };

  return updateDoc(doc(firestore, "absen-pal", id), data)
    .then(() => {
      return NextResponse.json({ message: `succes`, status }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code, status: !status },
        { status: 500 }
      );
    });
};
