"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import React, { Key } from "react";
import { usePathname, useRouter } from "next/navigation";

type TabOption = {
  id: string;
  label: string;
  href: string;
  disabled: boolean;
};

const options: TabOption[] = [
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
    <main className="h-screen bg-gray-50 text-sm text-gray-950 dark">
      {/* Header */}
      <div className="flex h-44 flex-col justify-end gap-4 bg-gray-950 p-8 pt-0 text-white">
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
      </div>
      {children}
    </main>
  );
}
