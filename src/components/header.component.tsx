"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const s = session as unknown as any;

  console.log("Header:session:", session);

  useEffect(() => {
    // check if the error has occurred
    console.log("Header:s?.error:", s?.error);
    if (s?.error === "AccessTokenError") {
      console.log("Header:: Sign out here");
      // Sign out here
      signOut();
    }
  }, [s?.error]);

  return (
    <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
