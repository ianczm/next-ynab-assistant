"use client";

import { NavOption } from "@/ui/types/navigation";
import { Tab, Tabs } from "@nextui-org/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Key } from "react";

export interface NavOptionTabsProps {
  options: NavOption[];
}

export function NavOptionTabs({ options }: Readonly<NavOptionTabsProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const handleSelectionChange = (key: Key) => router.push(key.toString());

  return (
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
  );
}
