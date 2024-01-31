"use client";
import image from "@/public/images/login.png";
import { useSession } from "next-auth/react";
const IsLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  if (!session.data?.user?.email)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex gap-1 items-center">
          <h1 className="text-2xl sm:text-3xl font-bold max-w-[200px]">
            Sorry, you need to login to access this page
          </h1>
          <img src={image.src} className="w-[150px] sm:w-[250px] h-fit" />
        </div>
      </div>
    );

  return <>{children}</>;
};
export default IsLoggedIn;
