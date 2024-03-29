import { firestore } from "@/utils/firebase/firebase";
import {
  FirestoreError,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth/authOptions";
import { isAdmin } from "@/utils/admin/AdminFunctions";

export const GET = async (
  req: Request,
  { params }: { params: { targetCollection: string; targetEmail: string } }
) => {
  const { targetCollection, targetEmail } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  if (userEmail != targetEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  let container: any[] = [];

  return getDocs(
    query(
      collection(firestore, targetCollection),
      where("creatorEmail", "==", targetEmail)
    )
  )
    .then((docSnapshot) => {
      docSnapshot.forEach((doc) => {
        container.push(doc.data());
      });
      return NextResponse.json({ container }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
