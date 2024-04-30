import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Turn an amount of milliseconds into a string representing the duration,
  * e.g. 61000 becomes '1:01'.
  */
export const msToTimecodeStr = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
      minutes +
      ":" +
      (remainingSeconds < 10 ? '0' : '') +
      remainingSeconds
  );
};
