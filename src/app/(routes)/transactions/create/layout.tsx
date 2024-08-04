import { NavOption } from "@/ui/types/navigation";
import React from "react";
import { NavOptionTabs } from "./nav-option-tabs";

const options: NavOption[] = [
  {
    id: "transportation",
    label: "Transportation",
    href: "/transactions/create/transportation",
    disabled: false,
  },
];

export default function CreateTransactionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-10 flex w-full flex-col justify-end gap-4 bg-gray-950 p-8 text-white">
        <p>Create transaction</p>
        <NavOptionTabs options={options} />
      </header>
      <main className="mb-40 text-sm text-gray-950">{children}</main>
    </>
  );
}
