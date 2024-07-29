import { LoginForm } from "@/components/loginForm";
import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Login() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-10 space-y-5">
      <h2 className="text-xl sm:text-2xl font-sans font-semibold text-center">
        Log in to make the best of Task Taker
      </h2>
      <div className="w-full max-w-md flex flex-col items-center">
        <LoginForm />
      </div>
    </div>
  );
}
