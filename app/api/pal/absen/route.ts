import { authOptions } from "@/utils/auth/authOptions";
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
import { getServerSession } from "next-auth";
import { isAdmin } from "@/utils/admin/AdminFunctions";

export const PATCH = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const { email, targetMonth, targetDay, tipe, time } = await req.json();

  if (email != session.user.email && targetDay) {
    const admin = await isAdmin(session.user.email);
    if (!admin) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }
  }

  const month = targetMonth || getToday("month+year");
  const day = targetDay || getToday("day");

  const absen: any = {
    [`absen-${month}.${day}`]: {
      tipe,
      time,
    },
  };

  if (targetDay) {
    absen[`absen-${month}.${day}.byPelatih`] = true;
  }

  return updateDoc(doc(firestore, "pal", email), absen)
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
