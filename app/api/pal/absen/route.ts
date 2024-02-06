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

  const { email, tipe, month, day } = await req.json();

  if (email != session.user.email && month && day) {
    const admin = await isAdmin(session.user.email);
    if (!admin) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }
  }

  const thisMonth = month || getToday("month+year");
  const todayDate = day || getToday("day");

  let data = {
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
