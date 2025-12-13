import { Cable } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="NetWeave Home">
      <Cable className="h-8 w-8 text-white" />
      <span className="text-2xl font-bold font-headline text-white text-shadow-lg">
        NetWeave
      </span>
    </Link>
  );
}
