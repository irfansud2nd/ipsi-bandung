import { firestore } from "@/utils/firebase/firebase";
import { FirestoreError, doc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth/authOptions";
import { isAdmin } from "@/utils/admin/AdminFunctions";

export const POST = async (
  req: Request,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const data = await req.json();

  return setDoc(doc(firestore, targetCollection, data.id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: `${
            targetCollection.charAt(0).toUpperCase() +
            targetCollection.slice(1, targetCollection.length - 1)
          } baru berhasil didaftarkan`,
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

export const PATCH = async (
  req: Request,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const data = await req.json();
  const userEmail = session.user.email;

  if (userEmail != data.creatorEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  return updateDoc(doc(firestore, targetCollection, data.id), data)
    .then((res) => {
      return NextResponse.json(
        {
          message: `${
            targetCollection.charAt(0).toUpperCase() +
            targetCollection.slice(1, targetCollection.length - 1)
          } berhasil didaftarkan ke event`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
