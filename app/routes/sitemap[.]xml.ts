import { getContacts } from "~/api/data";
import type { Route } from "./+types/sitemap[.]xml";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ request }: Route.LoaderArgs) {
  const { origin } = new URL(request.url);
  const response = await getContacts();

  const contacts = response.map((contact) => ({
    url: `${origin}/contacts/${contact.id}`,
    lastModified: contact.createdAt,
  }));
  const routes = ["", "/contacts"].map((route) => ({
    url: `${origin}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const itemsXml = [...routes, ...contacts].map(
    (route) => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${new Date(route.lastModified).toISOString().split("T")[0]}</lastmod>
      <priority>1.0</priority>
    </url>`,
  );

  const sitemap = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${itemsXml}
  </urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
}
