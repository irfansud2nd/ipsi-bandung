import { Id, toast } from "react-toastify";
import { string } from "yup";
import { events } from "../event/eventConstants";

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

// GENERATE TANGGAL
export const generateTanggal = (
  tanggal: string,
  shortMonth: boolean = false
) => {
  const date = new Date(tanggal);
  return `${date.getDate()} ${date.toLocaleString("id", {
    month: shortMonth ? "short" : "long",
  })} ${date.getFullYear()}`;
};

// GET EVENT TITLE
export const getEventTitle = (eventId: string) => {
  return events[events.findIndex((event) => event.id == eventId)].title;
};
