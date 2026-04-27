import { Link } from "react-router";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container mx-auto px-6 max-w-6xl py-10 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Journal</p>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Journal
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
