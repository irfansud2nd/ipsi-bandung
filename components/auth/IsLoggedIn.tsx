"use client";
import { useSession } from "next-auth/react";
import NotLoggedIn from "./NotLoggedIn";
const IsLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  if (!session.data?.user?.email) return <NotLoggedIn />;
  return <>{children}</>;
};
export default IsLoggedIn;
