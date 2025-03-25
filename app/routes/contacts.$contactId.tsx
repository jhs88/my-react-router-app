import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { Form, useFetcher } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/contacts.$contactId";

import { getContact, updateContact } from "~/api/data";

export async function action({ params, request }: Route.ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.contactId, "Missing contactId param");
  // const delay = (milliseconds: number) =>
  // new Promise((res) => setTimeout(() => res({ data: [] }), milliseconds));
  // const test = delay(2000);
  const contact = await getContact(params.contactId);
  if (!contact) throw new Response("Not Found", { status: 404 });
  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <Stack
      id="contact"
      sx={{
        p: "1rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        alt={`${contact.first} ${contact.last} avatar`}
        key={contact.avatar}
        src={contact.avatar}
        sx={{
          width: "50%",
          borderRadius: "50%",
        }}
      />
      <Stack
        direction="row"
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          {contact.first || contact.last
            ? `${contact.first} ${contact.last}`
            : "No Name"}
        </Typography>
        <Favorite contact={contact} />
      </Stack>
      {contact.twitter && (
        <Link
          variant="h4"
          href={`https://twitter.com/${contact.twitter}`}
          gutterBottom
        >
          {contact.twitter}
        </Link>
      )}
      {contact.notes && <Typography gutterBottom>{contact.notes}</Typography>}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: "2rem",
        }}
      >
        <Form action="edit">
          <Button variant="outlined" type="submit">
            Edit
          </Button>
        </Form>
        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record.",
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <Button variant="outlined" type="submit">
            Delete
          </Button>
        </Form>
      </Stack>
    </Stack>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <Button
        variant="outlined"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
        type="submit"
      >
        {favorite ? "★" : "☆"}
      </Button>
    </fetcher.Form>
  );
}
