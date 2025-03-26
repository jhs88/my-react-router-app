import { redirect } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/contacts.$contactId.destroy";

import { deleteContact } from "~/api/data";

export async function action({ params }: Route.ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  await deleteContact(params.contactId);
  return redirect("/contacts");
}
