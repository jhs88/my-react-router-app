import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useMatches,
  useNavigation,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/contacts";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";

import { createEmptyContact, getContacts } from "~/api/data";

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as { title?: string } | undefined;
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  const submit = useSubmit();

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link to="/contacts" className="text-2xl font-bold">
              Contacts
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Search</SidebarGroupLabel>
              <SidebarGroupContent>
                <Form
                  id="search-form"
                  onChange={(event) => {
                    const isFirstSearch = q === null;
                    submit(event.currentTarget, { replace: !isFirstSearch });
                  }}
                  role="search"
                  className="px-2"
                >
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="q"
                      name="q"
                      aria-label="Search contacts"
                      className={searching ? "opacity-50" : ""}
                      defaultValue={q ?? ""}
                      placeholder="Search"
                    />
                  </div>
                </Form>
                <Form method="post" className="px-2 mt-2">
                  <Button type="submit" variant="default" className="w-full">
                    New
                  </Button>
                </Form>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>All Contacts</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contacts.length ? (
                    contacts.map((contact) => (
                      <SidebarMenuItem key={contact.id}>
                        <SidebarMenuButton>
                          <NavLink
                            to={`${contact.id}`}
                            className={({ isActive }) =>
                              `flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors ${
                                isActive
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-muted"
                              }`
                            }
                          >
                            <span className="font-medium">
                              {contact.first ?? ""} {contact.last ?? ""}
                            </span>
                            {contact.favorite && <Star className="size-4 text-yellow-500" />}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No contacts
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <div
            className={`${
              navigation.state === "loading" && !searching ? "opacity-50" : ""
            }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
