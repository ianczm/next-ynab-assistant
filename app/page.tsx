import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen p-36">
      <div>
        <p>This is cool!</p>
        <p>
          Click <Link href={"/receivables/eefbb017-955c-4350-ad22-f7b4d3f53236"}>here to go to budget.</Link>
        </p>
      </div>
    </main>
  );
}
