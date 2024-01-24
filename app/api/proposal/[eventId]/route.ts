import { storage } from "@/utils/firebase/firebase";
import { StorageError, getDownloadURL, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { eventId: string } }
) => {
  const dir = `proposals/${params.eventId}.pdf`;

  return getDownloadURL(ref(storage, dir))
    .then((downloadUrl) => Response.json({ downloadUrl }, { status: 200 }))
    .catch((error: StorageError) =>
      Response.json(
        { message: error.message, code: error.code },
        { status: 500 }
      )
    );
};
