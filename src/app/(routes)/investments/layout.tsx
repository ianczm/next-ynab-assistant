"use client";

import { AccountMapper } from "@/lib/mappers/account";
import { AssistantApiClientProvider } from "@/providers/client/assistant-api-client-provider";
import { AccountNavOption } from "@/types/frontend/navigation";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useRouter } from "next/navigation";
import React, { Key, useCallback, useEffect, useState } from "react";

const apiClient = AssistantApiClientProvider.get();

export default function InvestmentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [options, setOptions] = useState<AccountNavOption[]>([]);

  const handleSelectionChange = (key: Key) => router.push(key.toString());

  const fetchOptions = useCallback(async () => {
    // Todo: make budgetId dynamic
    const result = await apiClient.getAccounts("eefbb017-955c-4350-ad22-f7b4d3f53236");
    const options = result.data.filter((account) => account.type === "otherAsset").map(AccountMapper.toNavOption);
    setOptions(options);
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return (
    <>
      <header className="sticky top-0 z-10 flex w-full flex-col justify-end gap-4 bg-gray-950 p-8 text-white">
        <p>Investments Dashboard</p>
        <Tabs
          defaultSelectedKey={options.length === 0 ? "" : options.at(0)!.href}
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
