import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function ContactsIndex() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        No contacts yet
      </h1>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        Get started by creating your first contact. You can edit, favorite, and
        search contacts from the sidebar.
      </p>
      <Link to="/contacts/new">
        <Button variant="default">New Contact</Button>
      </Link>
    </div>
  );
}
