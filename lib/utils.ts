import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { hash as hashArgon2, verify as verifyArgon2 } from "@node-rs/argon2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const defaultOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const hash = async (
  password: string,
  options: {
    memoryCost?: number;
    timeCost?: number;
    outputLen?: number;
    parallelism?: number;
  }
): Promise<string> => {
  return await hashArgon2(password, options);
};

export const verify = async (
  password: string,
  otherPassword: string
): Promise<boolean> => {
  return await verifyArgon2(password, otherPassword);
};
