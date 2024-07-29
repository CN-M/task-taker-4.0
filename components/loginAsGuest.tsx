import { validateRequest } from "@/lib/validate-request";
import { LoginAsGuestButton } from "./loginAsGuestButton";

export const LoginAsGuest = async () => {
  const { user } = await validateRequest();
  return (
    <div hidden={user ? true : false}>
      <LoginAsGuestButton />
    </div>
  );
};
