import Link from "next/link";
import { AuthButton } from "./authButton";
import { LoginAsGuest } from "./loginAsGuest";

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href={"/"} className="text-white text-2xl font-bold">
              Task Taker
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            {/* <form action={seedGuestAccounts}>
              <button>seed</button>
            </form> */}
            <LoginAsGuest />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
