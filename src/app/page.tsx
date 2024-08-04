import { NavOption } from "@/ui/types/navigation";
import { Button } from "@nextui-org/button";
import Link from "next/link";

const options: NavOption[] = [
  {
    id: "create-transactions",
    href: "/transactions/create",
    label: "Create Transactions",
    disabled: false,
  },
];

export default function Home() {
  return (
    <>
      <header className="flex h-44 flex-col justify-end gap-4 bg-gray-950 p-8 pt-0 text-white">
        <p>Next YNAB Assistant</p>
      </header>
      <main className="h-[calc(100vh-11rem)] bg-gray-50 text-sm text-gray-950 dark">
        <div className="flex flex-col gap-4 p-8 text-xs">
          {options.map((option) => (
            <Button
              key={option.id}
              href={option.href}
              className="h-auto w-full rounded-xl bg-gray-950 px-4 py-3 font-bold text-white"
              as={Link}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}
