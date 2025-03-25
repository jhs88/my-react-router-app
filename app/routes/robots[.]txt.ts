import type { Route } from "./+types/robots[.]txt";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ request }: Route.LoaderArgs) {
  const { origin } = new URL(request.url);

  const robotText = `
  User-agent: Googlebot
  Disallow: /nogooglebot/

  User-agent: *
  Allow: /

  Sitemap: ${origin}/sitemap.xml 
  `;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
