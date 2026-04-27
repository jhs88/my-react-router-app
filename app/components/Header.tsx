import { Link } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";

interface HeaderProps {
  currentPath?: string;
}

function NavLink({
  to,
  children,
  currentPath,
}: {
  to: string;
  children: React.ReactNode;
  currentPath?: string;
}) {
  const isActive = currentPath === to || (to !== "/" && currentPath?.startsWith(to));
  return (
    <Link
      to={to}
      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-foreground bg-muted/50"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header({ currentPath }: HeaderProps) {
  const isMobile = useIsMobile();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Journal" },
  ];

  const desktopNav = (
    <nav className="flex items-center gap-6">
      {navLinks.map((link) => (
        <NavLink key={link.to} to={link.to} currentPath={currentPath}>
          {link.label}
        </NavLink>
      ))}
      <ThemeToggle />
    </nav>
  );

  return (
    <header className="border-b border-border/50">
      <div className="container mx-auto px-6 max-w-6xl py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          Journal
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} currentPath={currentPath}>
                    {link.label}
                  </NavLink>
                ))}
                <div className="pt-4">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          desktopNav
        )}
      </div>
    </header>
  );
}
