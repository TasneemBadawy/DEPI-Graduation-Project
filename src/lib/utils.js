import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"; // الاسم الصح هنا twMerge

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}