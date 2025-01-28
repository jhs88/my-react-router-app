import type { Route } from "./+types/$";

export async function loader({ request }: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} Not Found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}
