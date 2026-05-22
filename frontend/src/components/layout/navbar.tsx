import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
};

const Navbar = ({ navItems }: { navItems: NavItem[] }) => {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 p-1 md:flex">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center gap-2 text-text-navlink hover:text-text-navlink-hover hover:bg-bg-navlink-hover px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-bg-navlink-active text-text-navlink-active"
                : "text-text-navlink hover:text-text-navlink-hover hover:bg-bg-navlink-hover",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
