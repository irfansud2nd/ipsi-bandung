import { isMaster } from "@/utils/admin/AdminFunctions";
import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  deleteField,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const PATCH = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const master = await isMaster(session.user.email);
  if (!master)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { email, compressedAbsen, month } = await req.json();
  return updateDoc(doc(firestore, "pal", email), {
    [`${month}-compressed`]: compressedAbsen,
    // [`${month}-hadir`]: deleteField(),
    // [`${month}-izin`]: deleteField(),
    // [`${month}-sakit`]: deleteField(),
    // [`${month}-alfa`]: deleteField(),
  })
    .then((res) => {
      return NextResponse.json(
        { message: "Compressed absen successfully sent" },
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
