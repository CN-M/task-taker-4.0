import { validateRequest } from "@/lib/validate-request";
import Link from "next/link";
import { LogoutButton } from "./logoutButton";

export const AuthButton = async () => {
  const { user } = await validateRequest();

  return (
    <div className="bg-emerald-500 rounded-lg px-5 py-2">
      {user ? (
        <LogoutButton />
      ) : (
        <Link className="bg-emerald-500 rounded-lg px-5 py-2" href={"/login"}>
          Login
        </Link>
      )}
      {/* {isError && <p className="text-red-500 text-sm">{errorMessage}</p>} */}
    </div>
  );
};
