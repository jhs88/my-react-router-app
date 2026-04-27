import { Form, useFetcher, useNavigation } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/contacts.$contactId";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

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
  const contact = await getContact(params.contactId);
  if (!contact) throw new Response("Not Found", { status: 404 });
  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigation = useNavigation();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center">
        <img
          alt={`${contact.first || ""} ${contact.last || ""} avatar`}
          src={contact.avatar}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-2">
            {contact.first || contact.last
              ? `${contact.first} ${contact.last}`
              : "No Name"}
          </h1>
          <Favorite contact={contact} />
        </div>
        {contact.twitter && (
          <a
            href={`https://twitter.com/${contact.twitter}`}
            className="text-primary hover:underline mt-2"
          >
            {contact.twitter}
          </a>
        )}
        {contact.notes && (
          <p className="mt-4 text-foreground/80">
            {contact.notes}
          </p>
        )}
        <div className="flex flex-row gap-2 mt-6">
          <Form action="edit">
            <Button type="submit" variant="default">
              Edit
            </Button>
          </Form>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete contact</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  contact record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Form action="destroy" method="post">
                  <AlertDialogAction>
                    <Button type="submit" variant="destructive" disabled={navigation.state === "submitting"}>
                      {navigation.state === "submitting" ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogAction>
                </Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: { favorite?: boolean; first?: string; last?: string } }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;
  const name = `${contact.first ?? ""} ${contact.last ?? ""}`.trim();

  return (
    <fetcher.Form method="post" className="mt-2">
      <Button
        type="submit"
        variant="outline"
        aria-label={favorite ? `Remove ${name || "this contact"} from favorites` : `Add ${name || "this contact"} to favorites`}
        name="favorite"
        value={favorite ? "false" : "true"}
        className="rounded-lg gap-2"
      >
        {favorite ? "★" : "☆"}
        <span className="sr-only">Favorite</span>
      </Button>
    </fetcher.Form>
  );
}
