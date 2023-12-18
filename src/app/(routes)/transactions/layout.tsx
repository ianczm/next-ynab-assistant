"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import React, { Key } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavOption } from "@/types/frontend/navigation";

const options: NavOption[] = [
  {
    id: "eating-out",
    label: "Eating Out",
    href: "/transactions/create/eating-out",
    disabled: false,
  },
  {
    id: "transportation",
    label: "Transportation",
    href: "/transactions/create/transportation",
    disabled: false,
  },
  {
    id: "others",
    label: "Others",
    href: "/transactions/create/others",
    disabled: false,
  },
];

export default function CreateTransactionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSelectionChange = (key: Key) => router.push(key.toString());

  return (
    <>
      <header className="sticky top-0 z-10 flex w-full flex-col justify-end gap-4 bg-gray-950 p-8 text-white">
        <p>Create transaction</p>
        <Tabs
          defaultSelectedKey={pathname}
          onSelectionChange={handleSelectionChange}
          classNames={{
            tabList: "rounded-xl bg-gray-800 p-0 gap-0",
            tab: "px-4 py-3 h-auto rounded-xl",
            tabContent: "text-xs font-bold text-gray-400 group-data-[selected=true]:text-gray-950",
            cursor: "dark:bg-white rounded-xl",
          }}
        >
          {options.map((option) => (
            <Tab key={option.href} id={option.id} title={option.label} isDisabled={option.disabled} />
          ))}
        </Tabs>
      </header>
      <main className="mb-40 text-sm text-gray-950">{children}</main>
    </>
  );
}
