"use client";
import { signIn, useSession, signOut } from "next-auth/react";

const LoginButton = () => {
  const session = useSession();
  return (
    <div>
      <button className="btn_green" onClick={() => signIn("google")}>
        Login
      </button>
      {session?.data?.user ? (
        <div className="flex gap-1">
          <button className="btn_red" onClick={() => signOut()}>
            Logout
          </button>
          <p>{session?.data.user.name}</p>
          <p>{session?.data.user.email}</p>
          {session.data.user.image && (
            <img
              src={session.data.user.image}
              alt=""
              className="w-5 h-5 rounded-full"
            />
          )}
          {session.data.user.email}
        </div>
      ) : null}
    </div>
  );
};

export default LoginButton;
