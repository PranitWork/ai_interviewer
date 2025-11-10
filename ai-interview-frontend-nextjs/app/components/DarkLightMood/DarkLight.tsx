"use client";
import { useEffect } from "react";

export function DarkLight() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) {
      // Default dark
      document.documentElement.classList.remove("light");
      return;
    }

    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  return null;
}
