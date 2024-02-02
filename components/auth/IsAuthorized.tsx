"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import NotLoggedIn from "./NotLoggedIn";
import FullLoading from "../loading/FullLoading";
import NotAuthorized from "./NotAuthorized";

type Props = {
  access: "admin" | "pal" | "master" | "palReverse";
  children: React.ReactNode;
};

const IsAuthorized = ({ access, children }: Props) => {
  const session = useSession();
  const [status, setStatus] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!session.data?.user?.email) return <NotLoggedIn />;

  useEffect(() => {
    if (session.data?.user?.email) checkAuthorize();
  }, [session.data?.user?.email]);

  const checkAuthorize = () => {
    axios
      .get(
        `/api/authorization/${access == "palReverse" ? "pal" : access}/${
          session.data.user?.email
        }`
      )
      .then((res) => {
        setOnRequest(res.data.onRequest);
        setStatus(res.data.authorized);
      })
      .catch((error: AxiosError) => {
        setStatus(false);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <FullLoading text="Memeriksa Akses" />;

  if (access == "palReverse") {
    if (onRequest) {
      return <NotAuthorized pal={{ onRequest }} />;
    } else {
      return <>{children}</>;
    }
  }

  if (!status)
    return <NotAuthorized pal={access == "pal" ? { onRequest } : undefined} />;

  return <>{children}</>;
};
export default IsAuthorized;
