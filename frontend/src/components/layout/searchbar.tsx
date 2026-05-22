import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Searchbar = () => {
  return (
    <div className="ml-auto hidden w-full max-w-xs items-center md:flex">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools, metrics..."
          className="h-10 rounded-full border-border/40 bg-card/40 pl-9 text-sm ring-offset-background file:border-0 bg-gray-100 file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-ring data-[state=open]:bg-transparent sm:w-auto"
        />
      </div>
    </div>
  );
};

export default Searchbar;
