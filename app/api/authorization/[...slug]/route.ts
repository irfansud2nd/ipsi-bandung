import { authOptions } from "@/utils/auth/authOptions";
import { firestore } from "@/utils/firebase/firebase";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string[] } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const type = params.slug[0];
  const email = params.slug[1];

  return getDocs(
    query(collection(firestore, type), where("email", "==", email))
  ).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return NextResponse.json({ authorized: false }, { status: 500 });
    } else {
      const data = querySnapshot.docs[0].data();
      if (data.verified) {
        return NextResponse.json({ authorized: true }, { status: 200 });
      } else {
        return NextResponse.json(
          { authorized: false, onRequest: true },
          { status: 200 }
        );
      }
    }
  });
};
