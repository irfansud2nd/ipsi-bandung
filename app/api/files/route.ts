import { storage } from "@/utils/firebase/firebase";
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const directory = formData.get("directory") as string;

  return uploadBytes(ref(storage, directory), file)
    .then((snapshot) =>
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        return NextResponse.json(
          { message: "Successfully Uploaded", downloadUrl },
          { status: 200 }
        );
      })
    )
    .catch((err: StorageError) => {
      return NextResponse.json(
        {
          message: err.message,
          code: err.code,
        },
        { status: err.status }
      );
    });
};

export const DELETE = async (req: Request) => {
  const { directory } = await req.json();
  return deleteObject(ref(storage, directory))
    .then(() =>
      NextResponse.json({ message: "Successfully Deleted" }, { status: 200 })
    )
    .catch((err: StorageError) =>
      NextResponse.json(
        { message: err.message, code: err.code },
        { status: err.status }
      )
    );
};
