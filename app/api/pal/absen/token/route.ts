import { isAdmin } from "@/utils/admin/AdminFunctions";
import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import { getToday } from "@/utils/pal/absen/PalAbsenFunctions";
import {
  FirestoreError,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const thisMonth = getToday("month+year");
const thisDay = getToday("fullDate");

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  return getDoc(doc(firestore, "absen-pal", thisMonth))
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return NextResponse.json(
          {
            token: data[`token-${thisDay}`],
            message: "Token already exist",
            status: data[`token-${thisDay}-status`],
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

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const admin = await isAdmin(session.user.email);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { token } = await req.json();

  const data = {
    [`token-${thisDay}`]: token,
    [`token-${thisDay}-status`]: true,
  };

  return setDoc(doc(firestore, "absen-pal", thisMonth), data)
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

export const PATCH = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const admin = await isAdmin(session.user.email);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { status } = await req.json();

  const data = {
    [`token-${thisDay}-status`]: status,
  };

  return updateDoc(doc(firestore, "absen-pal", thisMonth), data)
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
