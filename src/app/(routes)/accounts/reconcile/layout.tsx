import React from "react";

export default function AccountsReconcileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-36 w-full flex-col justify-end gap-4 bg-gray-950 p-8 text-white">
        <p>Reconcile Accounts</p>
      </header>
      <main className="mb-40 text-sm text-gray-950">{children}</main>
    </>
  );
}
