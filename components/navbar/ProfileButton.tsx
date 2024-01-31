"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import LoginButton from "../LoginButton";
import { useState } from "react";
import Link from "next/link";

const ProfileButton = () => {
  const session = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (!session.data?.user) {
    return (
      <button className="btn_green" onClick={() => signIn("google")}>
        Login
      </button>
    );
  }
  return (
    <div className="relative">
      <button onClick={() => setShowMenu((prev) => !prev)}>
        {session.data.user.image && (
          <img
            src={session.data.user.image}
            referrerPolicy="no-referrer"
            alt="Profile"
            className="w-8 h-8 rounded-full "
          />
        )}
      </button>
      {/* {showMenu && ( */}
      <div
        className={`bg-gray-50 border-gray-200 absolute right-0 flex flex-col items-end gap-1 font-normal text-base rounded-md shadow-lg transition-all overflow-hidden
          ${showMenu ? "max-h-[1000px] p-1 border-2" : "max-h-0"}`}
      >
        <p>{session.data.user.email}</p>
        <Link href={"/profile"}>Profile</Link>
        <button
          onClick={() => {
            setShowMenu((prev) => !prev);
            signOut();
          }}
          className="w-fit"
        >
          Logout
        </button>
      </div>
      {/* )} */}
    </div>
  );
};
export default ProfileButton;
