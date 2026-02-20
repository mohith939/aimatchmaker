import Link from "next/link";
import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="text-primary-foreground" />
             </div>
            <span className="text-primary">KIBI</span>
            <span className="text-foreground">Sports</span>
          </Link>
          <nav>
            {/* Future nav links can go here */}
          </nav>
        </div>
      </div>
    </header>
  );
}
