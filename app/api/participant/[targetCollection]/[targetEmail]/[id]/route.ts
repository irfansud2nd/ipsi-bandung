import { isAdmin } from "@/utils/admin/AdminFunctions";
import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import { FirestoreError, deleteDoc, doc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  {
    params,
  }: { params: { targetCollection: string; targetEmail: string; id: string } }
) => {
  const { targetCollection, targetEmail, id } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  if (userEmail != targetEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  return deleteDoc(doc(firestore, targetCollection, id))
    .then((res) => {
      return NextResponse.json(
        {
          message: `${
            targetCollection.charAt(0).toUpperCase() +
            targetCollection.slice(1, targetCollection.length - 1)
          } baru berhasil didaftarkan`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
