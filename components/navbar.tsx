import { loginAsGuest, logout } from "@/actions/authActions";
import { validateRequest } from "@/lib/validate-request";
import Link from "next/link";
import { Logo } from "./Logo";

export const Navbar = async () => {
  const { user } = await validateRequest();

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            {/* <Link href={"/"} className="text-white text-2xl font-bold">
              Task Taker
            </Link> */}
            <Link href={`/`}>
              <Logo />
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            {!user && (
              <form action={loginAsGuest}>
                <button className="bg-blue-500 rounded-lg px-5 py-2">
                  Login As Guest
                </button>
              </form>
            )}
            {user ? (
              <form action={logout}>
                <button className="bg-emerald-500 rounded-lg px-5 py-2">
                  Logout
                </button>
              </form>
            ) : (
              <Link
                className="bg-emerald-500 rounded-lg px-5 py-2"
                href={"/login"}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
