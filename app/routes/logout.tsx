import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/logout";
import { Button } from "~/components/ui/button";

import { getSession, destroySession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Logout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Log out
        </h1>
        <p className="text-muted-foreground">Are you sure you want to log out?</p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline">Never mind</Button>
        </Link>
        <Form method="post">
          <Button variant="destructive" type="submit">Log out</Button>
        </Form>
      </div>
    </div>
  );
}
