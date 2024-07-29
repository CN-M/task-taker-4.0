import { LoginForm } from "@/components/loginForm";

export default async function Login() {
  return (
    <div className="flex flex-col items-center p-6 sm:p-10 space-y-5">
      <h2 className="text-xl sm:text-2xl font-sans font-semibold text-center">
        Log in to make the best of Bird App
      </h2>
      <div className="w-full max-w-md flex flex-col items-center">
        <LoginForm />
      </div>
    </div>
  );
}
