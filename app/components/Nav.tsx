import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";

type Props = {};

const Nav = async (props: Props) => {
  const session = await getServerSession(options);
  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex w-full justify-between items-center px-10 py-4">
        <div>eBay API Tester</div>
        <div className="flex gap-10">
          <Link href="/">Home</Link>
          <Link href="/client">Client</Link>
          <Link href="/server">Server</Link>
          {session ? (
            <Link href="/api/auth/signout?callbackurl=/">LogOut</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
