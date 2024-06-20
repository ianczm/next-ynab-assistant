import { pretty } from "@/lib/utils/json";

export default function Pretty({ object }: Readonly<{ object: Object }>) {
  return <div className="whitespace-pre-wrap">{pretty(object)}</div>;
}
