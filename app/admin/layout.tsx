"use client";
import SideMenu from "@/components/admin/SideMenu";
import IsAuthorized from "@/components/auth/IsAuthorized";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <IsAuthorized access="admin">
      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] relative">
        <SideMenu />
        {children}
      </div>
    </IsAuthorized>
  );
};
export default layout;
