import { Form, redirect, useNavigate, useNavigation } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/contacts.$contactId_.edit";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";

import { getContact, updateContact } from "~/api/data";

export async function action({ params, request }: Route.ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates as Record<string, unknown>);
  return redirect(`/contacts/${params.contactId}`);
}

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) throw new Response("Not Found", { status: 404 });
  return { contact };
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();
  const navigation = useNavigation();

  return (
    <Form
      id="contact-form"
      method="post"
      className="max-w-2xl mx-auto p-4 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first">First Name</Label>
          <Input
            id="first"
            name="first"
            defaultValue={contact.first}
            placeholder="Bobby"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last">Last Name</Label>
          <Input
            id="last"
            name="last"
            defaultValue={contact.last}
            placeholder="Johnson"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            defaultValue={contact.twitter}
            placeholder="@jack"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            name="avatar"
            defaultValue={contact.avatar}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={contact.notes}
            rows={6}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" variant="default" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? (
            <>
              <Spinner className="size-4" />
              <span className="sr-only">Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Form>
  );
}
