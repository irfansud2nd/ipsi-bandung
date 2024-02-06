import { isAdmin } from "@/utils/admin/AdminFunctions";
import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import { FirestoreError, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const DELETE = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const admin = await isAdmin(session.user.email);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const email = params.email;

  return deleteDoc(doc(firestore, "pal", email))
    .then((res) => {
      return NextResponse.json(
        { message: "Request successfully deleted" },
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
