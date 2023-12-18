"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";
import { useRouter } from "next/navigation";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function Providers({
  children,
  nextThemeProps,
}: Readonly<{
  children: React.ReactNode;
  nextThemeProps: ThemeProviderProps;
}>) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...nextThemeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
