import type { Route } from "./+types/rss[.]xml";

import { getContacts } from "~/api/data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ request }: Route.LoaderArgs) {
  const { origin } = new URL(request.url);
  const response = await getContacts();

  const itemsXml = response
    .sort((a, b) => {
      if (new Date(a.createdAt) > new Date(b.createdAt)) {
        return -1;
      }
      return 1;
    })
    .map(
      (contact) =>
        `<item>
          <title>${contact.first} ${contact.last}</title>
          <link>${origin}/contacts/${contact.id}</link>
          <description>${contact.notes ?? ""}</description>
          <pubDate>${new Date(contact.createdAt).toUTCString()}</pubDate>
        </item>`,
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>RSS Feed</title>
        <link>${origin}</link>
        <description>Description</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
