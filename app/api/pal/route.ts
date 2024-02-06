import { isAdmin } from "@/utils/admin/AdminFunctions";
import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import axios from "axios";
import {
  FirestoreError,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const admin = await isAdmin(session.user.email);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  let pals: any[] = [];

  return getDocs(
    query(collection(firestore, "pal"), where("verified", "==", true))
  )
    .then((docSnapshot) => {
      if (docSnapshot.empty)
        return NextResponse.json(
          { message: "Data not found" },
          { status: 500 }
        );
      docSnapshot.forEach((doc) => {
        pals.push(doc.data());
      });
      return NextResponse.json({ pals }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
