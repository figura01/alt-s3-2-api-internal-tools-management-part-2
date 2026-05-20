import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-20 bg-gray-800 text-white p-0 flex items-center justify-center z-10 shadow-sm
    "
    >
      <h1 className="text-xl font-bold">My App</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header;
