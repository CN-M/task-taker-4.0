import { RegisterForm } from "@/components/registerForm";

export default async function Register() {
  return (
    <div className="flex flex-col p-10 items-center space-y-5">
      <h2 className="text-2xl font-sans font-semibold text-black/75 capitalize">
        Don't have an account?
      </h2>
      <hr className="border w-1/3 border-emerald-500/50" />
      <h2 className="text-2xl font-sans font-semibold text-black/75 capitalize">
        Register to make the best of Task Taker
      </h2>
      <hr className="border w-2/3 border-emerald-500/50" />
      <div className="flex flex-col items-center">
        <RegisterForm />
      </div>
    </div>
  );
}
