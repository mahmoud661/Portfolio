import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getInitialTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme === "light" ? "light" : "dark";
  }

  return "dark";
}
