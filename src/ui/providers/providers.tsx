"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";

export function Providers({
  children,
  nextThemeProps,
}: Readonly<{
  children: React.ReactNode;
  nextThemeProps: Omit<ThemeProviderProps, "children">;
}>) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...nextThemeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
