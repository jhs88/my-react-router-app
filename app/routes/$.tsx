import type { Route } from "./+types/$";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export async function loader({ request }: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} Not Found`, {
    status: 404,
  });
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
          Not Found
        </h1>
        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link to="/">
        <Button variant="default" size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
