import { storage } from "@/utils/firebase/firebase";
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Id, toast } from "react-toastify";

// CONTROL TOAST
export const controlToast = (
  message: string,
  ref: React.MutableRefObject<Id | null>,
  type: "loading" | "success" | "error",
  newToast: boolean = false
) => {
  if (newToast) {
    if (type == "loading") {
      ref.current = toast.loading(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      ref.current = toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        theme: "colored",
      });
    }
  } else {
    if (ref.current) {
      if (type === "loading") {
        toast.update(ref.current, {
          render: message,
        });
      } else {
        toast.update(ref.current, {
          render: message,
          type: type,
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      }
    }
  }
};

//COMPARE FOR DATA SORTER
export const compare = (query: string, type: "asc" | "desc") => {
  return (a: any, b: any) => {
    if (a[query] < b[query]) {
      return type == "asc" ? -1 : 1;
    }
    if (a[query] > b[query]) {
      return type == "asc" ? 1 : -1;
    }
    return 0;
  };
};
